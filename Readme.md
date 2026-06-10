Ejecución del proyecto
Requisitos previos

Para ejecutar la aplicación es necesario tener instalado:

- Docker Desktop
- Docker Compose

Ejecución:

Clonar el repositorio:

git clone https://github.com/AlejandroLilloRodriguez/TFG.git
cd TFG

Construir y levantar los contenedores:

docker compose up --build

La primera ejecución puede tardar unos minutos mientras Docker descarga las imágenes necesarias e instala las dependencias.

Acceso a la aplicación

Una vez iniciados los contenedores, la aplicación estará disponible en:

Frontend
http://localhost:5173
Backend
http://localhost:8000

Usuario admin : lillo 
contraseña : 1234

Usuario cliente : alejandro
contraseña : 1234