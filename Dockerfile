FROM node:20-alpine AS base
RUN apk update

FROM base as builder

WORKDIR /home/node

COPY package*.json ./
RUN npm i --include=dev

COPY tsconfig.build.json .
COPY src ./src
COPY tsconfig* ./
RUN npm run build

FROM node:20-alpine

WORKDIR /home/node

COPY --from=builder /home/node/package*.json ./
RUN npm i --omit=dev
RUN rm package*.json

COPY --from=builder /home/node/dist ./dist

RUN chown -R node:node .
USER node

CMD ["node", "dist/main.js"]
