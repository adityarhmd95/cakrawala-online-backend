FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --only=production

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]