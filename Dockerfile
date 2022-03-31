FROM node:16-alpine3.15 as development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn global add rimraf
RUN yarn --only=development
COPY . .