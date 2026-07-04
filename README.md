# Node-RED for Cloudron

Community [Cloudron](https://www.cloudron.io) package for [Node-RED](https://nodered.org), the low-code programming tool for event-driven applications.

## Features

* Node-RED 5.x on the official `cloudron/base` image
* Editor protected by **Cloudron single sign-on (OIDC)** — every Cloudron user with access to the app gets full editor permissions
* **Public HTTP endpoints**: `http in` nodes, dashboards, webhooks... are reachable without authentication
* **Palette Manager** works: extra nodes are installed into `/app/data` and survive updates and restarts
* Flows, credentials (encrypted with a per-install secret) and installed modules live in `/app/data` and are part of Cloudron backups
* 10 generic raw TCP ports (`TCP_PORT_1`..`TCP_PORT_10`) that the admin can enable and freely number on demand, for flows that need to listen on TCP (MQTT, Modbus, custom protocols...); a flow node binds one via `${TCP_PORT_n}`

## Installation

From the versions catalog (once the first release is published):

```
cloudron install --versions-url https://github.com/NaPs/cloudron-node-red/releases/latest/download/CloudronVersions.json
```

or add that URL in the Cloudron dashboard under *App Store* → *Add custom app* (Cloudron 9.1+). The URL always points to the latest release, so installed instances pick up updates automatically.

## Building from source

```
cloudron build --tag ghcr.io/naps/cloudron-node-red:1.0.0
cloudron install --image ghcr.io/naps/cloudron-node-red:1.0.0
```

A GitHub Actions workflow builds and pushes the image to GHCR automatically:

* push on `main` → `ghcr.io/naps/cloudron-node-red:latest`
* tag `vX.Y.Z` → `ghcr.io/naps/cloudron-node-red:X.Y.Z`, plus a GitHub release carrying the generated `CloudronVersions.json` as asset

> **Note**: the GHCR package must be made public after the first push (GitHub → Packages → package settings → visibility), otherwise Cloudron cannot pull the image.

## Package layout

| File | Purpose |
|------|---------|
| `Dockerfile` | Installs Node-RED and the OIDC passport strategy into `/app/code` |
| `settings.js` | Managed Node-RED settings (SSO, userDir, public endpoints) |
| `start.sh` | Seeds `/app/data`, generates the credential secret, drops privileges |
| `CloudronManifest.json` | Cloudron app manifest — single source of truth for the catalog |
| `.github/workflows/build.yml` | CI: builds the image and generates `CloudronVersions.json` (release asset) |

## Notes

* `settings.js` is fully managed by the package; it is not user-editable. Customization happens through the editor and `/app/data`.
* The credential secret is generated on first start and stored in `/app/data/.credential_secret`, so backups/restores keep flow credentials readable.
* Memory limit defaults to 1 GB (palette installs run `npm` inside the container).

## Releasing a new version

1. Bump `NODERED_VERSION` in the `Dockerfile` if Node-RED itself changed.
2. Tag `vX.Y.Z` and push. CI then builds and pushes `ghcr.io/naps/cloudron-node-red:X.Y.Z`, generates `CloudronVersions.json` from the manifest, and creates the GitHub release with the catalog attached.

Versions are injected by CI at release time: the package `version` comes from the git tag and `upstreamVersion` from the Dockerfile's `NODERED_VERSION` — the values in the committed `CloudronManifest.json` only matter for manual `cloudron install --image` testing. The commit titles since the previous version tag become the release notes and the catalog changelog.

The catalog contains only the released version (single entry). Older catalogs remain available on their respective releases (`releases/download/vX.Y.Z/CloudronVersions.json`).

## License

The package is provided under the MIT license. Node-RED itself is Apache-2.0.
