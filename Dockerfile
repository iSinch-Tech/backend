FROM node:20-alpine as development

WORKDIR /app

COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY package*.json ./

RUN npm ci

COPY src/ src/

COPY prisma/ prisma/

RUN npx prisma generate

RUN npm run build


FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package*.json ./
COPY --from=development /app/dist ./dist
COPY --from=development /app/prisma ./prisma/

EXPOSE 3000

CMD ["npm", "run", "start:migrate:prod"]
