const mongoose = require("mongoose");

const connection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/mi_blog", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conexión exitosa a la base de datos");
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
};

module.exports = connection;
