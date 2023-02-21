# NOTE: This Dockerfile should be build with project root as context
# Sample: docker build -f ./apps/api/Dockerfile .


# Copy source code and build the project
FROM node:18-alpine as builder
WORKDIR /builder
RUN apk add --no-cache git

COPY package.json yarn.lock ./
RUN yarn
COPY ./ ./
RUN yarn build:all


# Create image for the app by copying build artifacts from builder
FROM nginx:stable-alpine as runner
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
COPY --from=builder /builder/dist/dashboard /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
