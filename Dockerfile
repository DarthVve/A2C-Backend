FROM node:18-alpine

ENV NODE_ENV=development

USER node

WORKDIR /home/node/app

COPY . .

RUN yarn

RUN yarn build

EXPOSE 3500

VOLUME [ "$(pwd)/node_modules:/home/node/app/node_modules" ];

CMD ["yarn", "start"]
