# Node.js API REST

Este es un proyecto de una API REST construida con Node.js, Express y MongoDB. La API incluye funcionalidades como la creación, lectura, actualización y eliminación de artículos, así como la carga de imágenes y búsqueda por texto.

## 🚀 Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer (para carga de archivos)
- Validaciones personalizadas

## 📂 Estructura del proyecto

```
root
├── controllers/       # Controladores de la lógica de negocio
├── helpers/           # Funciones reutilizables
├── models/            # Modelos de Mongoose
├── routes/            # Definición de rutas
├── images/articles/   # Carpeta para imágenes subidas
├── index.js             # Configuración principal del servidor
└── .env.example       # Ejemplo del archivo de configuración de entorno
```

## ⚙️ Configuración

1. Clona este repositorio:
   ```bash
   git clone https://github.com/roberteban/API-Rest-Node.git
   cd api-rest-node
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura el archivo `.env`:
   Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`. Asegúrate de configurar:
   - `PORT`: Puerto donde se ejecutará el servidor.
   - `MONGO_URI`: URL de conexión a tu base de datos MongoDB.

4. Inicia el servidor:
   ```bash
   npm start
   ```

   El servidor estará disponible en `http://localhost:3900`.

## 🛠️ Endpoints

### Artículos

| Método | Endpoint               | Descripción                               |
|--------|------------------------|-------------------------------------------|
| GET    | `/api/articulos`       | Obtiene todos los artículos               |
| GET    | `/api/articulo/:id`    | Obtiene un artículo por su ID             |
| POST   | `/api/crear`           | Crea un nuevo artículo                    |
| PUT    | `/api/articulo/:id`    | Actualiza un artículo                     |
| DELETE | `/api/articulo/:id`    | Elimina un artículo                       |

### Imágenes

| Método | Endpoint                   | Descripción                           |
|--------|----------------------------|---------------------------------------|
| POST   | `/api/subir-imagen/:id`    | Sube una imagen para un artículo      |

### Búsqueda

| Método | Endpoint                   | Descripción                           |
|--------|----------------------------|---------------------------------------|
| GET    | `/api/buscar/:busqueda`    | Busca artículos por título o contenido |
