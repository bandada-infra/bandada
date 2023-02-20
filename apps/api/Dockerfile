# NOTE: This Dockerfile should be build with project root as context
# Sample: docker build -f ./apps/api/Dockerfile .


# Copy source code and build the project
FROM node:18-alpine as builder
WORKDIR /builder
COPY package.json yarn.lock ./
RUN yarn
COPY ./ ./
RUN yarn build:all


# Create image for the app by copying build artifacts from builder
FROM node:18-alpine as runner
USER node

ARG PORT=3000
ENV NODE_ENV=production

WORKDIR /home/node/api
COPY --chown=node:node  --from=builder /builder/dist/api ./

RUN yarn
# TODO: Fix the issue with NX not adding these packages to package.json automatically
RUN yarn add sqlite3 big-integer

EXPOSE ${PORT}
CMD ["node", "./main.js"]
