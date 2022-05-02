FROM node:16 AS ui-build

WORKDIR /usr/game/client
COPY /client ./
RUN npm install
RUN npm run build

FROM node:16 AS server-build

WORKDIR /usr/game

COPY --from=ui-build /usr/game/client/build/ ./client/build
WORKDIR /usr/game/server/

COPY /server/package*.json ./
RUN npm install

COPY /server/index.js ./

EXPOSE 8080

CMD [ "node", "index.js" ]