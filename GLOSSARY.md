# Domain Glossary

This glossary defines the architectural and domain concepts of the `chintan992dotdev` platform.

## Playback Engine
The core state machine that drives timeline progression, playhead positioning, transport clocking, scrubbing bounds, track filtering, and active clip resolution across the studio experience.

## Timecode
A formatted representation of time elapsed on the timeline (`MM:SS:FF`) at 24 frames per second, bound to a sequence maximum (`TOTAL_TIMELINE_SECONDS`).

## Timeline Clip
An immutable media segment scheduled on a specific timeline track, containing time offsets (`startTime`, `duration`), visual styling, metadata, and cross-discipline links.

## Track
A horizontal lane on the NLE timeline representing a creative or engineering discipline:
- `v1`: Primary 4K motion cinema reel
- `v2`: Secondary cinematography & fine stills
- `sys`: Software engineering architectures & runtimes
- `ops`: Changelog milestones, delivery logs, & infrastructure

## Transport
The playback control interface enabling real-time playhead advancement, step navigation (previous/next clip), scrubber positioning, and track filter selection.

## Program Monitor
The primary visual viewport rendering active clip media (HTML5 video with mute toggle, high-resolution still, or interactive system sandbox).

## Clip Inspector
The contextual metadata panel detailing active clip specifications, runtime dependencies, and system topology.

## Project Dossier
A structured case study documenting software architecture, technology stack, and engineering achievements, correlated directly to repository telemetry and timeline clips.

