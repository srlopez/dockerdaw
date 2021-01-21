FROM node
WORKDIR /app
# ====
# ARG CACHEBUST=1
# RUN git clone https://srlopez@dev.azure.com/srlopez/appapi/_git/appapi . && \
#     npm install
COPY package.json .
COPY appapi.js .
RUN npm install
# ====
ENV MYDBHOST=mydb
ENV MYDATABASE=mydb
ENV MYUSER=root
ENV MYPASSWORD=1234
ENTRYPOINT [ "node", "appapi.js" ]
# docker-compose necesita saber que puerta está dando servicio
# a la api
EXPOSE 7000