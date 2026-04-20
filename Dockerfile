FROM node:current-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @expo/ngrok

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--tunnel"]