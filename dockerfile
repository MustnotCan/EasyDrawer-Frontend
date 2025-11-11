FROM node:20 AS build
WORKDIR /build
COPY package.json .
RUN npm install
COPY . .
RUN npx react-router build

FROM nginx AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /build/build/client .
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["/entrypoint.sh"]
