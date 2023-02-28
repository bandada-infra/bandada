# NOTE: This Dockerfile should be build with project root as context
# Sample: docker build -f ./apps/dashboard/Dockerfile .

# Copy source code and build the project
FROM node:18-alpine as builder
RUN apk add --no-cache git

WORKDIR /builder
COPY ./.yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml tsconfig.json nginx.conf ./
COPY libs ./libs
COPY apps/dashboard ./apps/dashboard
RUN yarn install && yarn workspaces foreach -ptR --from '{dashboard,libs}' run build


# Create image for the app by copying build artifacts from builder
FROM nginx:stable-alpine as runner
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
COPY --from=builder /builder/apps/dashboard/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
