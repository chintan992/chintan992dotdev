#!/usr/bin/env node

/**
 * Upload photos & videos to Backblaze B2 Storage
 * Usage:
 *   node scripts/upload-media.mjs <file-or-dir> [remote-prefix]
 * Examples:
 *   node scripts/upload-media.mjs content/photos stills/
 *   node scripts/upload-media.mjs my-drone-reel.mp4 videos/
 */

import fs from 'node:fs';
import path from 'node:path';
import { AwsClient } from 'aws4fetch';

// Load variables from .dev.vars if present
function loadDevVars() {
  const varsPath = path.resolve(process.cwd(), '.dev.vars');
  if (fs.existsSync(varsPath)) {
    const lines = fs.readFileSync(varsPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*["']?(.*?)["']?\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2];
      }
    }
  }
}

loadDevVars();

const keyId = process.env.B2_APPLICATION_KEY_ID;
const appKey = process.env.B2_APPLICATION_KEY;
const bucket = process.env.B2_BUCKET_NAME || 'chintan992-content';
const endpoint = process.env.B2_ENDPOINT || 's3.us-east-005.backblazeb2.com';
const region = process.env.B2_REGION || 'us-east-005';

if (!keyId || !appKey) {
  console.error('Error: B2_APPLICATION_KEY_ID or B2_APPLICATION_KEY not found in environment or .dev.vars');
  process.exit(1);
}

const aws = new AwsClient({
  accessKeyId: keyId,
  secretAccessKey: appKey,
  service: 's3',
  region,
});

const mimeTypes = {
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.json': 'application/json',
};

async function uploadFile(localPath, remoteKey) {
  const ext = path.extname(localPath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const fileBuffer = fs.readFileSync(localPath);
  const s3Url = `https://${bucket}.${endpoint}/${encodeURI(remoteKey)}`;

  process.stdout.write(`Uploading ${path.basename(localPath)} -> ${remoteKey} ... `);

  const res = await aws.fetch(s3Url, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'Content-Length': fileBuffer.length.toString(),
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`FAILED (${res.status}): ${errorText}`);
    return false;
  }

  console.log(`✓ OK`);
  console.log(`  Live URL: https://media.chintan992.dev/${remoteKey}`);
  console.log(`  Path URL: /media/${remoteKey}`);
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node scripts/upload-media.mjs <file-or-dir> [remote-prefix]');
    console.log('Example: node scripts/upload-media.mjs sample.mp4 videos/');
    process.exit(0);
  }

  const targetPath = path.resolve(process.cwd(), args[0]);
  const prefix = (args[1] || '').replace(/^\/+/, '');

  if (!fs.existsSync(targetPath)) {
    console.error(`Error: File or directory not found: ${targetPath}`);
    process.exit(1);
  }

  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    const remoteKey = path.posix.join(prefix, path.basename(targetPath));
    await uploadFile(targetPath, remoteKey);
  } else if (stat.isDirectory()) {
    const files = fs.readdirSync(targetPath);
    for (const file of files) {
      const fullPath = path.join(targetPath, file);
      if (fs.statSync(fullPath).isFile()) {
        const remoteKey = path.posix.join(prefix, file);
        await uploadFile(fullPath, remoteKey);
      }
    }
  }
}

main().catch(console.error);
