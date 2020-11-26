FROM node
COPY package.json .
RUN yarn install
COPY /lib /app
COPY ../frontend/build /app/frontend
WORKDIR /app
EXPOSE 8080
CMD ["node", "index.js"]
