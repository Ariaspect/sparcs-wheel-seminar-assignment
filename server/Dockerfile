# Write server Dockerfile here
# For instructions, see https://github.com/SnowSuno/wheel-assignment-solution#1-dockerfile-%EC%9E%91%EC%84%B1

FROM node:16-alpine

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 80
ENV PORT 80
CMD ["npm", "run", "serve"]
