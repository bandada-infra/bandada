# NOTE: This Dockerfile should be build with project root as context
# Sample: docker build -f ./apps/api/Dockerfile .

# Copy source code and build the project
FROM node:18-alpine as builder

WORKDIR /builder

COPY . .

# Install dependencies only for the workspace needed
RUN yarn workspaces focus api @bandada/credentials @bandada/utils && \
    yarn workspaces foreach -ptR --from '{api, libs/credentials, lib/utils}' run build && \
    yarn workspaces focus api --production


# Create image for the app by copying build artifacts from builder
FROM node:18-alpine as runner
USER node

ARG PORT=3000
ENV NODE_ENV=production

WORKDIR /home/node/api
COPY --chown=node:node --from=builder /builder/node_modules ./apps/node_modules
COPY --chown=node:node --from=builder /builder/apps/api ./apps/api
COPY --chown=node:node --from=builder /builder/libs ./apps/libs

EXPOSE ${PORT}
CMD ["node", "./apps/api/dist/main.js"]
