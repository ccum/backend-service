# Imagen node base inicial
FROM node:latest

# Crear directorio de trabajo del contenedor
WORKDIR /docker-api

# Copiar archivos del proyecto al directorio de docker
ADD . /docker-api

# Instalar las dependencias del proyecto en produccion
# RUN npm install --production
# ò               --only=production

#Definir puerto donde exponemos nuestro contenedor (mismo que definimos en nuestra API)
EXPOSE 3000

#Lanzar la aplicacion (appe.js, "run" si no es start )
CMD ["npm", "start"]
