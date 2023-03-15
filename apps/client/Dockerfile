# NOTE: This Dockerfile should be build with project root as context
# Sample: docker build -f ./apps/client/Dockerfile .

# Copy source code and build the project
FROM node:18-alpine as builder
RUN apk add --no-cache git

WORKDIR /builder
COPY . .
RUN yarn install && yarn workspaces foreach -ptR --from '{client,libs}' run build


# Create image for the app by copying build artifacts from builder
FROM nginx:stable-alpine as runner
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
COPY --from=builder /builder/apps/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
