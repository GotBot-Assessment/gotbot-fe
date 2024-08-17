FROM node:20-alpine as development

WORKDIR /app

COPY package*.json .

COPY . .

RUN npm install

EXPOSE 4200

#Run the app in dev mode.
CMD ["npm", "start"]

FROM node:20-alpine as production

WORKDIR /app

COPY --from=development /app /app

RUN npm run build -- --configuration=development

FROM httpd:alpine as server

COPY --from=production /app/dist/got-bot-chef/browser /usr/local/apache2/htdocs/

EXPOSE 80
