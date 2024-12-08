const connection = require("./database/connection");
const express = require("express");
const cors = require("cors"); // Importar cors

// Crear servidor Node
const app = express();
const puerto = 3900;

// Función para iniciar la aplicación
const startApp = async () => {
    try {
        // Conectar a la base de datos
        await connection();
        console.log("Conexión a la base de datos exitosa");

        // Configurar middlewares
        app.use(cors()); // Configurar cors
        app.use(express.json()); // Convertir body a objeto JS
        app.use(express.urlencoded({extended:true})); //form-urlencoded

        // Importar y configurar rutas
        const articleRoutes = require("./routes/article");
        app.use("/api", articleRoutes);

        // Rutas de Prueba
        app.get("/probando", (req, res) => {
            console.log("Se ha ejecutado el endpoint /probando");
            return res.status(200).json([
                {
                    curso: "Master en React",
                    autor: "Roberto Castillo",
                    url: "robertocastillo.cl",
                },
                {
                    curso: "Master en Angular",
                    autor: "Pablo Castillo",
                    url: "pablocastillo.cl",
                },
            ]);
        });

        app.get("/", (req, res) => {
            return res.status(200).send(
                "<h1>Empezando a crear API Rest con Node</h1>"
            );
        });

        // Iniciar servidor
        app.listen(puerto, () => {
            console.log("Servidor corriendo en el puerto " + puerto);
        });
    } catch (error) {
        console.error("Error al iniciar la aplicación:", error.message);
    }
};

// Iniciar la aplicación
startApp();
