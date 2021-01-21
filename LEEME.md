## Composición de contenedores

De propósito educativo, este repositorio pretende mostrar las capacidades de composición de contenedores y su relación. Las aplicaciones conterizadas son básicas.

Se trata de un CRUD de una tabla en la que intervienen 6 contenedores.

BACKEND:  
 - Contenedor MySQL
 - en appdata se guarda un script SQL que añade algún dato a la tabla
 - en el mismo directorio se crea el volumen donde MySQL almacenará las bases de datos. 
 - No utilizamos volumen gestionado por Docker 
 - HOST mydb
 - BATABASE data
 - USUARIO/CONTRASEÑA root/1234


API:
 - una aplicacion node.js que accede a la BD  
 - en el directorio appapi
 - este servicio puede lanzarse en 'modo balanceado'   si a la hora de levantar la aplicación se incluye el parámetro --scale myapi=X  
 - incluye un feo delay para esperar que la base de datos arranque antes de conectarse

GATEWAY:  
 - hace de PROXY INVERSO a la API
 - Una configuración nginx que se encuentra en appgateway
  
FRONTENDs:  
 - Un frontend en node.js en appwb
 - Un frontend similar en laravel en applaravel
   - https://dev.azure.com/srlopez/_git/laraweb?path=%2FLEEME.txt 
 - Un frontend para administrar la DB descrito en el compose.

## SETUP 
Si es la primera vez que ejecutamos la pila de contenedores combiene seguir estos pasos.

Trabajamos en el directorio 'app' 


### 1.- DB MySQL

- En el directorio app lanzamos los servicios  
`docker-compose up -d mydb mydbadmin`  

- y confirmamos que accedemos a la db por el forntend de db.  
`xdg-open http://localhost:8088`   

- Creamos la DB y añadimos algún dato  
`docker exec -i mysqlc mysql -u root -p1234 data <../appdata/data.sql`  
`docker exec -it mysqlc mysql -u root -p1234 data -e "select * from users;"`

### 2.- Contenedor de la api PORT 7000

> Para el tema de espera hay varias soluciones: https://docs.docker.com/compose/startup-order/

- Creacion de la aplicacion api en contenedor  
`docker-compose build myapi`   

- La corremos
```
docker-compose up -d myapi
xdg-open http://localhost:7000/api/v1/users
```

### 3.- Proxy Inverso / gateway PORT 8888

Se trata de un nginx con configuración de proxypass a la api

- Lanzamos el proxy  
```sh
docker-compose up -d mygateway
xdg-open http://localhost:8888/api/v1/users
xdg-open http://localhost:8888/
docker-compose ps
```

### 4.- Frontend NODE PORT 7077

- Creacion de la aplicacion web en contenedor y lanzamiento

```bash
docker-compose build myfrontend
docker-compose up -d myfrontend
xdg-open http://localhost:7077
docker-compose ps
```

### 5.- Frontend Laravel PORT 8081

- https://dev.azure.com/srlopez/_git/laraweb?path=%2FLEEME.txt
- Creacion de la aplicacion laravel web en contenedor
`docker-compose build laraweb`   

- Podemos ejecutarla así `docker-compose up -d laraweb` o de forma manual
`docker run --rm --network app_default -v $(pwd)/laravel.env:/var/www/laravel/.env -p 8082:80 -it laraweb`


### CONCLUSION

Una vez que tenemos datos en la DB podríamos lanzar el resstode contenedores con `docker-compose up --scale myapi=5`, que sería como lanzar y crear si es necesario el resto de contenedores.


En resumen hemos hecho:

```sh
docker-compose up -d mydb mydbadmin
docker exec -i mysqlc mysql -u root -p1234 data <../appdata/data.sql
docker exec -it mysqlc mysql -u root -p1234 data -e "select * from users;"
docker-compose up --scale myapi=5
```

Los links de que todo se ha lanzado correctamente:

[phpmyadmin](http://localhost:8088): `xdg-open http://localhost:8088`   
A la api no podemos acceder si la hemos escalado, y la permitimos en docker-compose
[api](http://localhost:7000/api/v1/users): `xdg-open http://localhost:7000/api/v1/users`  
[gateway control](http://localhost:8888/): `xdg-open http://localhost:8888/`  
[gateway api](http://localhost:8888/api/v1/users): `xdg-open http://localhost:8888/api/v1/users`  
[frontend](http://localhost:7077): `xdg-open http://localhost:7077`  
[laravelweb](http://localhost:8081): `xdg-open http://localhost:8081`  



==== OTRAS NOTAS ====
 



== CREAR UN PROYECTO LARAVEL ==
docker run --rm -v $(PWD):/hostlocal -w /hostlocal -it srlopez/laravel:6.12 composer create-project --prefer-dist laravel/laravel src
# Apartir de aquí se desarrolla la aplicación.



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