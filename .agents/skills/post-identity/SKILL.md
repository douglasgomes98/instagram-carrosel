---
name: post-identity
description: Apply this project's visual identity when creating, editing, or reviewing the actual Instagram post/carousel artwork (slides, backgrounds, colors, imagery, and text treatment) — as opposed to the app's own UI, which is covered by project-design.
---

# Post identity

Before designing or generating carousel slide content, read `.agents/skills/post-identity/DESIGN.md` and use it as the source of truth for the posts' visual identity: color palette and roles, component stylings, layout principles, depth/elevation, do's and don'ts, and responsive behavior.

This design system is a deliberate blend of two references pulled via `npx getdesign@latest`:
- **Base identity (colors, components, layout, elevation):** Starbucks (`npx getdesign@latest add starbucks`) — four-tier green system, warm cream canvas, full-pill shapes.
- **Typography only (Section 3):** ElevenLabs (`npx getdesign@latest add elevenlabs`) — Waldenburg Light display + Inter body, dark cinematic editorial feel.

Do not re-run `getdesign add starbucks` with `--force` on this file — it would overwrite the merged typography section. To refresh either source, regenerate into a scratch path and re-merge by hand, keeping Section 3 sourced from ElevenLabs and every other section from Starbucks.

Preserve the product's existing content requirements (copy, slide count, aspect ratio). When the requested design conflicts with `DESIGN.md`, follow the user's explicit request and keep the rest of the system consistent.

Reuse existing project components and tokens (see `src/ScaledSlide.tsx`, `src/CropStudio.tsx`, `src/styles.css`) where they already express this identity. When implementation details are missing from `DESIGN.md`, infer the smallest consistent extension from its established patterns.

After implementation, verify the affected slides render correctly at the target export size, and check text contrast against backgrounds/imagery.
