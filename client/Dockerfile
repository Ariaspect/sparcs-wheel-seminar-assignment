# Write client Dockerfile here
# For instructions, see https://github.com/SnowSuno/wheel-assignment-solution#1-dockerfile-%EC%9E%91%EC%84%B1

FROM node:16-alpine

WORKDIR /app
COPY . .

RUN npm install && \
    npm install react-inject-env@2.1.0 --save && \
    npm install serve@14.1.2 -g

ENV REACT_APP_BACK_URL=http://13.125.235.54/api \
    REACT_APP_S3_URL=https://wheel-seminar-s3-bucket.s3.ap-northeast-2.amazonaws.com

RUN npm run build

EXPOSE 80
CMD ["sh", "-c", "npx react-inject-env set && serve -s build -l 80"]
