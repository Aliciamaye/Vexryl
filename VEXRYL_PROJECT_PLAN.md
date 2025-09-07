# Vexryl — Full Project Plan

## Core Constraints
- **Domain:** FreeDNS only.
- **Repository & CI/CD:** GitHub only.
- **No user bot processes hosted on our infra.** Platform is orchestrator + exporter.
- **Hosting:** Only free services with no time limits, suspensions, hidden caps, or credit card requirements.
- **Frontend Hosting:** Cloudflare Pages (recommended).
- **Backend Hosting:** Cloudflare Workers (API), Supabase (database), Cloudflare D1 (alternative DB), GitHub for snapshots/archives.
- **All canonical data stored as JSON/text.**

---

## Directory Structure

```
apps/
  web/         # Frontend (Cloudflare Pages)
  api/         # Backend API (Cloudflare Workers)
  emulator/    # Event emulator/testing
packages/
  core/        # Core logic, types, utilities
  blocks/      # Block definitions, templates
  modules/     # Prebuilt modules (moderation, economy, etc.)
  marketplace/ # Marketplace logic
database/
  snapshots/   # GitHub snapshots/archives
  backups/     # Periodic backups
  projects/    # Project data (JSON)
docs/
  guides/      # Tutorials, guides
  api/         # API documentation
  examples/    # Example projects/flows
.github/
  workflows/   # CI/CD pipelines
scripts/
  deploy/      # Deployment scripts
  migrate/     # Migration scripts
.vexryl/
  config/      # Platform configs
  templates/   # Block/code templates
public/
  assets/      # Static assets
  images/      # Images, icons
```

---

## Product Vision

- No-code Discord bot platform for all users.
- Visual block builder, block-level code editing, full Discord event coverage.
- Advanced flow logic, variable/data system, scriptable block inputs.
- Public marketplace, real-time collaboration, version control, JSON-first storage, JSON → .js generator pipeline.
- Responsive, futuristic UI (glassmorphism, neon, Monaco editor, live logs).
- Integrated documentation hub.

---

## Project & Storage Model

- **Project:** metadata, bots[], templates[], env vars, secrets (encrypted), block graphs.
- **Bot:** name, token placeholder, intents, modules, commands[], eventListeners[].
- **Block:** id, type, inputs, outputs, optional script, metadata, version history.
- **Flow:** directed graph connecting blocks.
- **All data:** JSON/text, stored in Supabase/Cloudflare D1, exported to GitHub.

---

## Block System

- Deterministic transform units: inputs → transformation → outputs.
- Local block state, bot-level persisted state.
- Editable in isolation, snapshot per edit (diff/rollback).

---

## Scriptable Inputs

- Only block-flows are script-editable.
- Each input: `value` (static) or `script` (JS string).
- Scripts isolated per block instance.

---

## Scriptable Block Types

- sendMessage, sendEmbed, editMessage, deleteMessage
- sendModal, showModal, modalResponse
- createChannel, editChannel, deleteChannel
- addRole, removeRole, createRole, editRole
- sendDM, bulkMessage, replyWithAttachment
- createThread, createInvite, manageWebhook
- httpRequest, callAPI, fileUpload, saveAttachment
- scheduleMessage, cronTask, customCodeBlock, module actions

---

## Variables & Data Binding

- Blocks expose variables downstream.
- Namespaces: `$msg.*`, `$cmd.*`, `$modal.*`, `$http.*`, `$user`, `$role`, `$channel`, `$guild`.
- Types: string, number, boolean, user, role, channel, guild, message, attachment, list, object, timestamp, mentionable.

---

## Command Builder

- Slash commands, parameters, subcommands, groups.
- Localization, permissions, responses, cooldowns.

---

## Events

- Full Discord event coverage, all payload variables exposed.

---

## Conditions & Flow

- Permission checks, role membership, channel type, message filters, rate limits, external lookups.
- Flow constructs: sequential, branching, switch, loops, parallel, try/catch, subflows, scheduled tasks.
- Conditions are declarative only.

---

## Modules & Actions

- Prebuilt modules: moderation, automod, welcome, reaction roles, leveling, ticket system, polls, economy.
- Configurable via dashboard UI/commands.

---

## Marketplace

- Users publish commands, event listeners, blocks, flows.
- Unique IDs, browse/preview/import, items stored as JSON.

---

## Real-Time Collaboration

- Multi-user editing, live cursors, inline comments.
- Roles: Viewer, Editor, Admin.
- Change history per user.

---

## Version Control & Rollback

- Each save = snapshot/commit.
- Visual diff UI, rollbacks, tagging.

---

## Hosting Integration

- Users connect hosting provider accounts.
- Controls: Deploy, Stop, Restart, View Logs.
- Console viewer streams logs, file viewer for deployed files.
- Internally stored as JSON, converted to `.js` on export/deploy.

---

## JSON → .js Generator

- Input: project JSON.
- Validate schema, map blocks to code templates, inject scripts.
- Generate `index.js`, `package.json`, configs.
- Bundle and deploy.

---

## Limits

- 5 bots/account.
- Per bot: 15 slash commands, 10 event listeners, 6 prebuilt modules.

---

## Testing

- Emulator for events, unit tests per block, end-to-end flow tests, mock HTTP APIs.

---

## Export & Deployment

- Export: ZIP, GitHub repo, JSON manifest.
- Deployment: auto-generate `.js` and push to provider.

---

## Security

- No raw token storage, secrets encrypted.
- No user code on our infra.
- Abuse prevention: quotas, moderation, rate limits.

---

## GitHub Push Strategy

- Supabase/Cloudflare D1 stores all live user edits (fast writes).
- GitHub used only for snapshots/archives.
- Manual “Save to GitHub” button, automatic on milestones, periodic backups.
- Commits batched/squashed to avoid API limits.
- If repo grows too large, shard per-user/project directories.

---

## Backend Hosting Plan

- **API:** Cloudflare Workers (free, no time limits, no credit card).
- **Database:** Supabase (free tier, generous limits, no credit card) or Cloudflare D1.
- **Frontend:** Cloudflare Pages.
- **CI/CD:** GitHub Actions.
- **No paid/limited services, no user code on our infra.**

---

Let me know if you want to expand any section or need implementation steps for any part!
