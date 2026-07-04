FROM cloudron/base:5.0.0

ARG NODERED_VERSION=5.0.1

RUN mkdir -p /app/code /app/pkg
WORKDIR /app/code

# node-red itself and the passport strategy used by settings.js for Cloudron OIDC login
RUN npm install --omit=dev node-red@${NODERED_VERSION} passport-openidconnect@0.1.2 && \
    npm cache clean --force

COPY start.sh settings.js package.json.template /app/pkg/
RUN chmod +x /app/pkg/start.sh

ENV HOME=/app/data

CMD [ "/app/pkg/start.sh" ]
