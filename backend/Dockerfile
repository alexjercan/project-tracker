FROM node
COPY package.json .
RUN yarn
COPY /lib /app
WORKDIR /app
EXPOSE 8080
CMD ["node", "index.js"]
