FROM node:18-bullseye-slim

# Create app directory
WORKDIR /usr/src/app

# Reduce layers: copy package.json and install first
COPY package.json ./
RUN npm install --production

# Copy rest of the source
COPY . .

ENV PORT=5000
EXPOSE 5000

CMD ["npm", "start"]
