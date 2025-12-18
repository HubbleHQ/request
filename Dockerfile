# Our base image
FROM node:24-alpine as base

# Create app directory
WORKDIR /src

# Configure OS to use the Yardi VPN certificate
COPY build-scripts/ca-certs ./build-scripts/ca-certs
RUN ./build-scripts/ca-certs/import-certs

# Common env var used for CA certs
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt

# Necessary for VS Code extensions in dev containers
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

RUN apk add --no-cache git zsh

FROM base AS deps

COPY ["package.json", "yarn.*", "./"]

FROM deps AS deps-dev
RUN yarn

FROM deps-dev as dev
COPY . .

CMD [ "yarn", "start" ]

FROM deps AS production

RUN yarn --production=true
COPY . .

CMD [ "yarn", "start" ]

# Set the default target. This way, if we run `docker build` without specifying
# a target, it will build the production image. NOTE: this _must_ be the last
# line in the file.
FROM production
