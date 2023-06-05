# Our base image
FROM node:16-alpine as base

# Create app directory
WORKDIR /src

RUN apk add --no-cache git

FROM base AS deps
# Install *only* the production dependencies
COPY ["package.json", "yarn.*", "./"]
RUN yarn

FROM deps AS deps-dev
RUN yarn

RUN apk add --no-cache curl tar

FROM deps-dev as dev
COPY . .
CMD [ "yarn", "start" ]

FROM deps AS production
COPY . .
CMD [ "yarn", "start" ]

# Set the default target. This way, if we run `docker build` without specifying
# a target, it will build the production image. NOTE: this _must_ be the last
# line in the file.
FROM production