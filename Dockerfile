FROM node:14-alpine AS BUILD_IMAGE

RUN apk add --no-cache make gcc g++

WORKDIR /usr/src/select-markets

COPY . .

RUN npm install
RUN npm run build
RUN npm prune --production

FROM node:14-alpine

WORKDIR /usr/src/select-markets

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/select-markets/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/select-markets/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/select-markets/scripts ./scripts
COPY --from=BUILD_IMAGE /usr/src/select-markets/prisma ./prisma
COPY --from=BUILD_IMAGE /usr/src/select-markets/package.json ./package.json

RUN apk add --no-cache tzdata
ENV TZ=America/Sao_Paulo

EXPOSE 3000
CMD [ "npm", "run", "prod:run" ]