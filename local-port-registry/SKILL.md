---
name: local-port-registry
description: Use when Codex or another coding agent creates, modifies, starts, or documents a local development service; chooses or edits a PORT value; changes .env, package scripts, Docker Compose, Next.js, Vite, API, worker, admin, webhook, database, or AI gateway ports; or needs to respect user-level reserved/preferred local ports and avoid conflicts on Linux or macOS.
---

# Local Port Registry

Before assigning or changing any local development port, consult a local registry and runtime listeners. This skill is self-contained; do not assume a separate package, CLI, dashboard, or daemon exists.

## Registry Resolution

Resolve the active registry in this order:

1. A registry path explicitly provided by the user.
2. `PORT_REGISTRY_FILE`.
3. A project-local `.vibe-ports.json`.
4. `~/.config/vibe-ports/ports.json`.

If no registry exists, ask before creating a global registry. For project-contained work, create or update a project-local registry only when that file is in scope for the requested code change.

Never commit, upload, paste, or expose a personal registry unless the user explicitly asks. A registry can contain local project names, URLs, commands, and notes.

## Minimal Registry Shape

Use structured JSON parsing and writing. Preserve unknown fields.

```json
{
  "version": 1,
  "defaults": {
    "host": "127.0.0.1",
    "primaryPlatform": "linux",
    "supportedPlatforms": ["linux", "darwin"]
  },
  "ranges": [],
  "entries": []
}
```

Entries use this shape:

```json
{
  "port": 3001,
  "status": "assigned",
  "project": "my-app",
  "service": "web",
  "type": "frontend",
  "host": "127.0.0.1",
  "url": "http://localhost:3001",
  "notes": "Main local web app"
}
```

## Status Semantics

- `reserved`: user-level reservation. Do not use for another service even when the port is not listening.
- `preferred`: project or tool recommendation. Use only when the current project/service matches.
- `assigned`: assigned to a concrete local service.
- `blocked`: never use.

User preferences belong in the registry. Treat them as stronger than framework defaults such as `3000`, `3001`, `5173`, or `8000`.

## Default Ranges

Use registry ranges when present. If the registry has no ranges, use these defaults:

| Type | Range | Use |
| --- | ---: | --- |
| `frontend` | 3000-3099 | Browser apps, docs previews, Next.js, Vite, Astro |
| `api` | 3100-3199 | HTTP APIs, BFFs, model adapters, webhook receivers |
| `worker` | 3200-3299 | Queue workers, automation runners, crawlers |
| `admin` | 3300-3399 | Dashboards, docs, inspector panels, admin consoles |
| `webhook` | 4000-4099 | Local callbacks, tunnels, OAuth redirects |
| `experiment` | 5000-5999 | Demos, prototypes, temporary research apps |
| `database` | 5400-6499 | Postgres, Redis, vector stores, datastore dashboards |
| `ai-gateway` | 18700-18799 | Local AI gateways and agent control planes |

## Runtime Checks

Registry checks and runtime checks are separate gates:

```txt
registry allows + runtime free = usable
registry blocks + runtime free = not usable
registry allows + runtime listening = not usable for a new service
```

On Linux, inspect listeners with `ss -H -ltnp` when available.

On macOS, inspect a specific port with `lsof -nP -iTCP:<port> -sTCP:LISTEN`.

Do not kill a process occupying a port unless the user explicitly asks.

## Workflow

1. Classify the service as `frontend`, `api`, `worker`, `admin`, `webhook`, `experiment`, `database`, or `ai-gateway`.
2. Inspect existing project config before changing ports: `.env*`, package scripts, Docker Compose files, framework configs, service launch scripts, and docs touched by the task.
3. Resolve and read the registry before choosing a port.
4. Prefer an existing matching entry for the same `project` and `service` when it does not conflict with runtime state.
5. For a new port, scan the service type range from low to high and choose the first candidate that is not blocked by registry status and is not listening at runtime.
6. Write ports through environment variables or config options when the framework supports it. Avoid hardcoding unless the surrounding project already does.
7. Update the registry after assigning a port. Preserve formatting when practical; otherwise write stable, readable JSON with two-space indentation.
8. Summarize the selected port, registry entry changed, runtime check used, and any remaining uncertainty.

## Selection Rules

- Never use a `blocked` port.
- Never use a `reserved` port for a different project/service.
- Use a `preferred` port only for its matching project/service.
- Treat an `assigned` port as unavailable unless it already belongs to the current project/service.
- If a user explicitly names a port, still validate it against the registry and runtime listener state before writing it.
- If every port in a range is unavailable, stop and report the conflict instead of guessing a random port.
