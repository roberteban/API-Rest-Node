const fs = require("fs");
const path = require("path");
const { validateArticle } = require("../helpers/validate");
const Article = require("../models/article");
const { join } = require("path");
const { json } = require("express");
const { uptime } = require("os");

// Función reutilizable para validar IDs
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Controlador de artículos
const test = (req, res) => {
    return res.status(200).json({
        message: "Soy una acción de prueba de mi controlador de artículos",
    });
};

const course = (req, res) => {
    console.log("Se ha ejecutado el endpoint probando");
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
};

// Crear artículo
const postArticle = (req, res) => {
    // Recoger parámetros por POST
    const parameters = req.body;
    // Validar datos
    try {
        validateArticle(parameters);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
    // Crear objeto basado en el modelo
    const article = new Article({
        title: parameters.title,
        content: parameters.content,
        image: parameters.image || "default.png", // Si no hay imagen, usa una predeterminada
    });
    // Guardar artículo en la base de datos
    article.save((error, savedArticle) => {
        if (error || !savedArticle) {
            return res.status(500).json({
                status: "error",
                message: "No se ha podido guardar el artículo",
            });
        }
        // Devolver resultado en caso de éxito
        return res.status(200).json({
            status: "success",
            article: savedArticle,
            message: "¡Artículo creado con éxito!",
        });
    });
};

// Conseguir artículos
const listArticles = (req, res) => {
    // Crear consulta inicial
    let query = Article.find().sort("-date"); // Ordenar por fecha descendente
    // Verificar si se solicitan solo los últimos artículos
    const limit = parseInt(req.params.ultimos, 10); // Asegurar que sea un número entero
    if (!isNaN(limit) && limit > 0) {
        query = query.limit(limit); // Limitar el número de artículos
    }
    // Ejecutar consulta
    query.exec((error, articles) => {
        if (error) {
            return res.status(500).json({
                status: "error",
                message: "Error al realizar la consulta",
            });
        }
        if (!articles || articles.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No se han encontrado artículos",
            });
        }
        // Respuesta en caso de éxito
        return res.status(200).json({
            status: "success",
            count: articles.length,
            articles,
        });
    });
};

// Conseguir un artículo
const getArticle = (req, res) => {
    // Recoger un id por la url
    const { id } = req.params;
    // Validar formato del ID
    if (!isValidObjectId(id)) {
        return res.status(400).json({
            status: "error",
            message: "El ID proporcionado no es válido",
        });
    }
    // Buscar el artículo por ID en la base de datos
    Article.findById(id, (error, article) => {
        // Manejar errores en la consulta o artículo no encontrado
        if (error) {
            return res.status(500).json({
                status: "error",
                message: "Error al realizar la búsqueda",
            });
        }
        if (!article) {
            return res.status(404).json({
                status: "error",
                message: "No se ha encontrado el artículo con ese ID",
            });
        }
        // Devolver el resultado en caso de éxito
        return res.status(200).json({
            status: "success",
            article,
        });
    });
};

// Eliminar artículo
const deleteArticle = (req, res) => {
    // Obtener el ID desde los parámetros
    const { id } = req.params;
    // Validar formato del ID
    if (!isValidObjectId(id)) {
        return res.status(400).json({
            status: "error",
            message: "El ID proporcionado no es válido",
        });
    }
    // Buscar y eliminar el artículo
    Article.findOneAndDelete({ _id: id }, (error, deletedArticle) => {
        // Manejar errores en la consulta
        if (error) {
            return res.status(500).json({
                status: "error",
                message: "Error al intentar eliminar el artículo",
            });
        }
        // Manejar caso en que no se encuentre el artículo
        if (!deletedArticle) {
            return res.status(404).json({
                status: "error",
                message: "No se encontró un artículo con ese ID",
            });
        }
        // Devolver resultado en caso de éxito
        return res.status(200).json({
            status: "success",
            article: deletedArticle,
            message: "¡Artículo eliminado con éxito!",
        });
    });
};

// Editar artículo
const putArticle = (req, res) => {
    // Recoger ID del artículo a editar
    const { id } = req.params;
    // Validar formato del ID
    if (!isValidObjectId(id)) {
        return res.status(400).json({
            status: "error",
            message: "El ID proporcionado no es válido",
        });
    }
    // Recoger datos del body de la solicitud
    const parameters = { ...req.body };
    // Validar datos
    try {
        validateArticle(parameters);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
    // Buscar y actualizar artículos
    Article.findOneAndUpdate(
        { _id: id },
        parameters,
        { new: true, runValidators: true }, // Validar y devolver el artículo actualizado
        (error, updatedArticle) => {
            // Manejar errores en la base de datos
            if (error) {
                return res.status(500).json({
                    status: "error",
                    message: "Error al intentar editar el artículo",
                });
            }
            // Manejar caso en que no se encuentre el artículo
            if (!updatedArticle) {
                return res.status(404).json({
                    status: "error",
                    message: "No se encontró un artículo con ese ID",
                });
            }
            // Devolver respuesta en caso de éxito
            return res.status(200).json({
                status: "success",
                article: updatedArticle,
            });
        }
    );
};

// Subir archivos
const uploadImage = (req, res) => {
    // Validar que el archivo haya sido subido
    if (!req.file || !req.file.originalname) {
        return res.status(400).json({
            status: "error",
            message: "No se ha subido ningún archivo",
        });
    }
    // Nombre del archivo
    const fileName = req.file.originalname;

    // Obtener la extensión del archivo
    const extensionFile = fileName.split(".").pop().toLowerCase();

    // Comprobar la extensión correcta
    const validExtensions = ["png", "jpg", "jpeg", "gif"];
    if (!validExtensions.includes(extensionFile)) {
        // Borrar archivo y devolver error
        fs.unlink(req.file.path, () => {
            return res.status(400).json({
                status: "error",
                message: "Extensión de archivo no válida",
            });
        });
        return; // Salir de la función
    }
    // Recoger el ID del artículo
    const articleId = req.params.id;
    // Buscar y actualizar el artículo
    Article.findOneAndUpdate(
        { _id: articleId },
        { image: req.file.filename },
        { new: true },
        (error, updatedArticle) => {
            if (error || !updatedArticle) {
                return res.status(500).json({
                    status: "error",
                    message: "Error al actualizar el artículo o no se encontró",
                });
            }

            // Devolver respuesta en caso de éxito
            return res.status(200).json({
                status: "success",
                article: updatedArticle,
                file: req.file,
            });
        }
    );
};

const image = (req, res) => {
    // Obtener el nombre del archivo
    const file = req.params.file;
    const physicalRoute = `./images/articles/${file}`;

    // Comprobar si el archivo existe
    fs.stat(physicalRoute, (error) => {
        if (error) {
            return res.status(404).json({
                status: "error",
                message: "La imagen no existe",
            });
        }

        // Enviar el archivo
        return res.sendFile(path.resolve(physicalRoute));
    });
};

// Buscador
const seeker = (req, res)=>{
    // Sacar del string de busqueda
    let search = req.params.search;

    // Find OR
    Article.find({"$or":[
        {"title": {"$regex": search, "$options": "i"}},
        {"content": {"$regex": search, "$options": "i"}},
    ]})
    // Orden
    .sort({fecha:-1})
    .exec((error,articlesFound)=>{
        if(error||!articlesFound||articlesFound.length<=0){
            return res.status(404).json({
                status: "error",
                message: "No se han encontrado artículos",
            });
        }
        return res.status(200).json({
            status: "success",
            articles: articlesFound,
        })
    })
}

// Exportar el controlador
module.exports = {
    test,
    course,
    postArticle,
    listArticles,
    getArticle,
    deleteArticle,
    putArticle,
    uploadImage,
    image,
    seeker,
};
