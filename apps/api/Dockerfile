# NOTE: This Dockerfile should be build with project root as context
# Sample: docker build -f ./apps/api/Dockerfile .

# Copy source code and build the project
FROM node:18-alpine as builder
RUN apk add --no-cache git

WORKDIR /builder
COPY ./.yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml tsconfig.json ./
COPY libs ./libs
COPY apps/api ./apps/api
RUN yarn install && yarn workspaces foreach -ptR --from '{api,libs}' run build


# Create image for the app by copying build artifacts from builder
FROM node:18-alpine as runner
USER node

ARG PORT=3000
ENV NODE_ENV=production

WORKDIR /home/node/api
COPY --chown=node:node  --from=builder /builder/ ./

EXPOSE ${PORT}
CMD ["node", "./apps/api/dist/main.js"]
