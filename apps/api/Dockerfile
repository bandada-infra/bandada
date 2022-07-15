FROM node:14-alpine
# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN mkdir -p /api
ADD . /api

WORKDIR /api

RUN yarn cache clean

RUN yarn install --production=false

# Build production files
RUN yarn build

# Bundle app source
COPY . .

EXPOSE 3333
CMD ["node", "dist/apps/api/main.js"]
