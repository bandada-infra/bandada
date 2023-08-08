# NOTE: This Dockerfile should be build with project root as context
# Sample: docker build -f ./apps/client/Dockerfile .

# Copy source code and build the project
FROM node:18-alpine as builder
RUN apk add --no-cache git

ARG BUILD_LOCAL

WORKDIR /builder
COPY . .
RUN yarn install --silent && yarn workspaces foreach -ptR --from '{libs}' run build
RUN if [ "$BUILD_LOCAL" = "true" ]; \
    then yarn run build:local; \
    else yarn run build; \
    fi  

# Create image for the app by copying build artifacts from builder
FROM nginx:stable-alpine as runner
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
COPY --from=builder /builder/apps/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
