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
FROM nginx:stable-alpine as runner
COPY --from=builder /builder/dist/apps/client /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
