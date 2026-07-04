// Node-RED settings for Cloudron. This file is fully managed by the package:
// changes will be overwritten on app updates. Use the editor and /app/data for
// user-level customization (flows, palette modules, static files...).

const fs = require('fs');

const settings = {
    userDir: '/app/data',
    flowFile: 'flows.json',
    credentialSecret: fs.readFileSync('/app/data/.credential_secret', 'utf8').trim(),

    uiHost: '0.0.0.0',
    uiPort: 1880,

    // editor lives at /, http-in/dashboard endpoints are served from / as well
    // (Node-RED defaults). The editor is protected by adminAuth below, the
    // HTTP endpoints created by flows are public.
    httpAdminRoot: '/',
    httpNodeRoot: '/',

    // File nodes resolve relative paths against the persistent data directory
    fileWorkingDirectory: '/app/data',

    // allow palette and function-node module installs (into /app/data)
    functionExternalModules: true,
    functionTimeout: 0,

    logging: {
        console: { level: 'info', metrics: false, audit: false }
    },

    editorTheme: {
        page: { title: 'Node-RED' },
        header: { title: 'Node-RED' },
        codeEditor: { lib: 'monaco' },
        projects: { enabled: false }
    }
};

// Cloudron OIDC login for the editor. Any Cloudron user with access to this
// app gets full editor permissions.
if (process.env.CLOUDRON_OIDC_ISSUER) {
    const OpenIDConnectStrategy = require('/app/code/node_modules/passport-openidconnect');

    settings.adminAuth = {
        type: 'strategy',
        strategy: {
            name: 'openidconnect',
            label: 'Sign in with ' + (process.env.CLOUDRON_OIDC_PROVIDER_NAME || 'Cloudron'),
            icon: 'fa-cloud',
            strategy: OpenIDConnectStrategy.Strategy,
            options: {
                issuer: process.env.CLOUDRON_OIDC_ISSUER,
                authorizationURL: process.env.CLOUDRON_OIDC_AUTH_ENDPOINT,
                tokenURL: process.env.CLOUDRON_OIDC_TOKEN_ENDPOINT,
                userInfoURL: process.env.CLOUDRON_OIDC_PROFILE_ENDPOINT,
                clientID: process.env.CLOUDRON_OIDC_CLIENT_ID,
                clientSecret: process.env.CLOUDRON_OIDC_CLIENT_SECRET,
                callbackURL: process.env.CLOUDRON_APP_ORIGIN + '/auth/strategy/callback',
                scope: ['openid', 'profile', 'email'],
                verify: function (issuer, profile, done) {
                    profile.username = profile.username
                        || (profile._json && profile._json.preferred_username)
                        || (profile.emails && profile.emails[0] && profile.emails[0].value)
                        || profile.id;
                    done(null, profile);
                }
            }
        },
        users: function (username) {
            // Cloudron only authenticates users that have access to the app
            return Promise.resolve({ username: username, permissions: '*' });
        }
    };
}

module.exports = settings;
