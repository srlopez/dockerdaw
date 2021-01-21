FROM node
WORKDIR /app
# ===
# ARG CACHEBUST=1
# RUN git clone https://srlopez@dev.azure.com/srlopez/appweb/_git/appweb . && \
#    npm install
COPY public ./public
COPY views ./views
COPY appweb.js .
COPY package.json .
RUN npm install
# ===
ENV INNERAPIHOST=mygateway:80
ENV PUBLICAPIHOST=localhost:8888

ENTRYPOINT [ "node", "appweb.js" ]
EXPOSE 7077