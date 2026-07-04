Node-RED is a programming tool for wiring together hardware devices, APIs and online services in new and interesting ways.

It provides a browser-based editor that makes it easy to wire together flows using the wide range of nodes in the palette that can be deployed to its runtime in a single click.

### Features

* **Browser-based flow editing** with a rich text editor for functions, templates and flows
* **Built on Node.js**, taking full advantage of its event-driven, non-blocking model
* **Extensible palette** — install any of the thousands of community nodes directly from the editor (Palette Manager)
* **Social development** — flows are stored as JSON and can be easily shared

### Cloudron integration

* Editor access is protected by Cloudron single sign-on (OIDC) — every user with access to the app gets full editor permissions
* HTTP endpoints created by flows (`http in` nodes, dashboards...) are publicly reachable, so webhooks and dashboards work out of the box
* Flows, credentials and palette-installed nodes are stored in `/app/data` and included in Cloudron backups
