FROM node:16.14.0-alpine

# Copy source code
COPY package*.json ./

# Running npm install
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Open the mapped port
EXPOSE 3000

RUN npm run build

CMD [ "npm", "start"]
