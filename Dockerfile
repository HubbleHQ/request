# Our base image
FROM node:12.16.3

ENV YARN_VERSION 1.22.4

# Create app directory
WORKDIR /src
RUN apt-get update && apt-get clean

RUN curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
  && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
  && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
  && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
  && rm yarn-v$YARN_VERSION.tar.gz

COPY ["package.json", "yarn.*", "./"]

# Install app dependencies
# with yarn
RUN yarn

COPY . .

RUN yarn build
RUN yarn docs:build

# Run the application
CMD [ "yarn", "start" ]
