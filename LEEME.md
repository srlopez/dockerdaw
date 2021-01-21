## 

Lanza 5 contenedores y myapi lo lanza 5 veces.
Publica una aplicación frontend web para hacer un CRUD 7077
Ésta se conecta a un gateway que hace de balanceador 8888 scon una API REST
El backend api persiste datos en MYSQL
Y se publica un GUI para gestión de MYSQL 8088

Para arrancar todo la primera vez, arancamos la db e insertamos algún registro. Luego arrancamos el resto de servicios (sin -d para ver como se va accediendo a distintos contenedores de la api)

```sh
docker-compose up -d mydb mydbadmin
docker exec -i mysqlc mysql -u root -p1234 data <../appdata/data.sql
docker exec -it mysqlc mysql -u root -p1234 data -e "select * from users;"
docker-compose up --scale myapi=5
```

Comprobamos que todo va en los links

[phpmyadmin](http://localhost:8088): `xdg-open http://localhost:8088`   

[api](http://localhost:7000/api/v1/users): `xdg-open http://localhost:7000/api/v1/users`  
[gateway](http://localhost:8888/api/v1/users): `xdg-open http://localhost:8888/api/v1/users`  
[frontend](http://localhost:7077): `xdg-open http://localhost:7077`  


## Setup DB y frontend para DB
directorio: .
servicio: mydb, mydbadmin
db data root/1234


- Lanzamos los servicios  
`docker-compose up -d mydb mydbadmin`  

- Confirmamos que accedemos a la db por el forntend de db.  
`xdg-open http://localhost:8088`   

- Creamos la DB y añadimos algún dato  
`docker exec -i mysqlc mysql -u root -p1234 data <../appdata/data.sql`  
`docker exec -it mysqlc mysql -u root -p1234 data -e "select * from users;"`


## Contenedor de la api
directorio: appapi
servicio: myapi

> Ojo! Arrancar la api, e intentar conectarse a mysql sin que este esté arrancado cierra el servicio
> Es un error tipico de ccomposicion de contenedores
> Hay varias soluciones: https://docs.docker.com/compose/startup-order/

- Creacion de la aplicacion api en contenedor
`docker-compose build myapi`   

- La corremos
`docker-compose up myapi`
`xdg-open http://localhost:7000/api/v1/users`

## Proxy Inverso / gateway
Servicio:  mygateway

Un nginx con configuracion de proxypass a la api

- Lanzamos el proxy
`docker-compose up -d mygateway`   
`xdg-open http://localhost:8888/api/v1/users`

## Frontend
Servicio:  myfrontend

- Creacion de la aplicacion web en contenedor
`docker-compose build myfrontend`   




== CREAR UN PROYECTO LARAVEL ==
docker run --rm -v $(PWD):/hostlocal -w /hostlocal -it srlopez/laravel:6.12 composer create-project --prefer-dist laravel/laravel src
# Apartir de aquí se desarrolla la aplicación.


==== OTRAS NOTAS ====

El diagrama está subido a:
https://kroki.io/c4plantuml/svg/eNqNlM2O2jAUhfd5CpcVIxUImqqgroa_qkgMpPx01FV0Sa7AqhNbtjMQVX2YPkN33fJivQ4hMDO0HVbG-XJ87rnXuTMWtM0S4b3haSSyGDMt2NZaZT60Whp2zQ2322ydGdSRTC2mthnJpDXnEehYTjkqFK3Bu0YgILWr-0lLo0Aw2Go3fNoPB_QS8BR1U7lTPG_S-zpbLcPlLAiHs4ep51luBbIhh42GBFiMbFAchLHUaDxvkRuLSdiXWRqDzuuR_5bVcG9Rp7J2w757jH4BaiPTcLS3dWeViIHgZBbZw6hfu7nGiAto0pv3vowmL0GIE54SOOyznluWxNFTHZS6EOkFY3r844rjNlGxjL6hblB4Shps5omozFcZ1Xe4Do-iH3URQlz4p_9TScE0GO4VhWLczoInioIbzFfD0tVTHQEarghNaPsRxf8UNmBxBzlRfaDWRgjUjsLIhqd7t1Ba7vNQAbl5_jIoXpbRB6qaDnfZXK2ipzhDE9EZMTCaMFYGpF-Ixutwk_HLioZFQWqr7vNjc5yeW3BjNUT88CulcRKM1B65s_9McrgmUddcsLCmmXXvJ_ni86TISRoWg5Xm2FNvjuI0NhfpdrvdtqODw0_KBUw5bgSHqxN-jpLobmEyGLPg8Hst6BYd6XJqz_3v-J3OP4VfqVspXtD-iR2n7had0Io4t6_j-xU8RxAlWQFFfLe3_nsHfVougxI49epvz8trVbW065cFPO1edZx6RbXeHc0EfWP-AFeJg64=


== BASES DE DATOS ==
MS SQLSERVER
docker run --name mssql -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD=Pa88word -p 1433:1433 -v mssql:/var/opt/mssql -d mcr.microsoft.com/mssql/server
sqlcmd -U SA -P Pa88word -S localhost,1434
sqlcmd -U SA -P Pa88word -S localhost,1434 -d BASE -Q "SELECT * FROM ARTICULOS"

MONGO
docker run --name mongo -e MONGO_INITDB_ROOT_USERNAME=sa -e MONGO_INITDB_ROOT_PASSWORD=Pa88word -p 27017:27017  -v mongo:/data/db -d mongo

POSTGRESQL
docker run --name postgres -e POSTGRES_PASSWORD=Pa88word -p 5432:5432  -v pgdata:/var/lib/postgresql/data -d postgres

MYSQL
docker run --name mysql5 -p 3306:3306 -v mydata:/var/lib/mysql -d mysql:5.7
docker exec -it mysql5 mysql mydb

== ENTORNO DE DESARROLLO ==
PYTHON
docker run -it --rm --name python -v %cd%:/app -w /app python:3.6 bash