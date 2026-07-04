Node-RED is ready.

* Open the app and sign in with your Cloudron account (OIDC). Every Cloudron user with access to this app gets **full editor permissions** — restrict access in the app's *Access Control* settings if needed.
* HTTP endpoints created by your flows (`http in` nodes, dashboards...) are **publicly accessible** without authentication.
* Flows, credentials and extra nodes installed from the Palette Manager are stored in `/app/data` and included in backups.
* 10 generic raw TCP ports (`TCP_PORT_1`..`TCP_PORT_10`) are available for flows that need to listen on TCP (MQTT, Modbus, custom protocols...). They are **disabled by default** — enable the ones you need and pick their port number under the app's *Location* / port settings. A flow node must listen on the chosen port via the environment variable, e.g. set the `tcp in` node's port to `${TCP_PORT_1}`. These bypass the reverse proxy, so they carry no automatic TLS.
