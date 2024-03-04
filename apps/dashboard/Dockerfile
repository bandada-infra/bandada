# NOTE: This Dockerfile should be build with project root as context
# Sample: docker build -f ./apps/dashboard/Dockerfile .

# Copy source code and build the project
FROM node:18-alpine as builder

WORKDIR /builder

COPY . .

# Install dependencies only for the workspace needed
RUN yarn workspaces focus dashboard @bandada/api-sdk @bandada/utils && \
    yarn workspaces foreach -ptR --from '{dashboard, libs/credentials, libs/utils}' run build

# Create image for the app by copying build artifacts from builder
FROM nginx:stable-alpine as runner
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
COPY --from=builder /builder/apps/dashboard/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
