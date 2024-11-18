FROM node:latest AS builder
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build


FROM node:latest
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "start:prod"]
