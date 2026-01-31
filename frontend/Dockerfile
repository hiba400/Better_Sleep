# Frontend Dockerfile (dev)
FROM node:18

WORKDIR /app

# copy package files then install to leverage cache
COPY package*.json ./
RUN npm ci

# copy everything
COPY . .

# expose the Next.js dev server port
EXPOSE 3000

# run Next.js dev and bind to 0.0.0.0
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
