# chintan992.dev

Two-mode portfolio for Chintan Rathod, built with React, TypeScript, Vite, and a Cloudflare Worker. The software portfolio uses an editorial dark palette; the photography and film portfolio uses a cinematic, day/night palette. Both modes use locally bundled Bricolage Grotesque and DM Sans fonts.

The motion system uses a short font-aware entry, a scroll-aware header, and transform-only pointer interactions on desktop. Reduced-motion preferences skip the entry and reveal animations; there is no custom cursor or scroll hijacking.

## Local development

```sh
npm install
npm run dev
```

The Vite server serves the portfolio UI. To test Worker behavior locally, first build the static assets and then run:

```sh
npm run build
npm run dev:worker
```

The inquiry endpoint returns a clear configuration error until the Resend API key is set. No inquiry is reported as sent unless Resend accepts it. The photography gallery uses curated sample images until the Instagram Graph API is configured.

## Cloudflare deployment

1. Add `chintan992.dev` to the Cloudflare account and confirm the zone is active.
2. Create proxied DNS records for the apex and a wildcard (`*`) subdomain. The Worker routes in `wrangler.jsonc` target both `chintan992.dev/*` and `*.chintan992.dev/*`.
3. In a Resend account, verify the recipient address `chintanr21@gmail.com`. The initial sender is `onboarding@resend.dev`; to send from an address on `chintan992.dev`, verify the domain in Resend and update `CONTACT_FROM_EMAIL`.
4. To enable the live Instagram gallery, configure an Instagram Graph API user ID as the non-secret `INSTAGRAM_USER_ID` Worker variable and add the corresponding access token as a Worker secret. Configure `INSTAGRAM_USER_ID` in the Cloudflare dashboard or as a local Wrangler variable. Create the secrets and deploy:

   ```sh
   npm install
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put INSTAGRAM_ACCESS_TOKEN
   npm run deploy
   ```

   Set API keys and access tokens only through secret prompts; never commit them. `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are non-secret Worker variables in `wrangler.jsonc`.
5. Confirm that the homepage, inquiry delivery, and project hostnames resolve after deployment. The first project previews are:
   - `https://letstream.chintan992.dev`
   - `https://xplayer.chintan992.dev`
   - `https://forge.chintan992.dev`
   - `https://assetize.chintan992.dev`
   - `https://linze.chintan992.dev`

Project hostnames are explicitly registered in `src/worker.ts`. Add a project to that registry before advertising its hostname; unknown project subdomains return 404. Replace the preview response with the real app when it is ready.

## Inquiry form

The form posts same-origin to `/api/inquiry`; the Worker validates the input and sends a plain-text email using Resend. The sender and recipient must be valid and configured for the Resend account. The API key is a Cloudflare Worker secret, not a build-time variable. If the service is not configured or delivery fails, the visitor is directed to email `chintanr21@gmail.com` directly.

The form includes basic field validation and a honeypot. Consider adding a Cloudflare rate-limiting rule before broad promotion.
