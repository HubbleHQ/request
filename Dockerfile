# Our base image
FROM node:20-alpine as base

# Create app directory
WORKDIR /src

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
