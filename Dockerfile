FROM node:22-alpine AS builder

WORKDIR /pomoday

COPY package.json .

RUN npm install --global corepack@latest
RUN corepack enable pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

CMD pnpm run start
