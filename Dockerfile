FROM node:8

RUN npm install -g @angular/cli@1.7.4

WORKDIR /app

CMD npm install && ng serve --host 0.0.0.0 --port 4200
