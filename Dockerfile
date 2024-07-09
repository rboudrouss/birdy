FROM node:22

WORKDIR /app

COPY . .

RUN npm install --production
RUN npx prisma generate
# exit 0 is used to ignore the error, for the case when the database is already created
RUN npx prisma migrate deploy; exit 0
RUN npm run build
CMD ["npm", "start"]