FROM node:16-alpine

ARG NODE_ENV=production
ARG PORT=3333

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

USER node
WORKDIR /home/node/api

COPY --chown=node:node ./dist/apps/api .

RUN yarn
RUN yarn add big-integer

EXPOSE ${PORT}

CMD ["node", "./main.js"]
