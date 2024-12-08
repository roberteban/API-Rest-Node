const fs = require("fs");
const path = require("path");
const { validateArticle } = require("../helpers/validate");
const Article = require("../models/article");

// Helper para validar IDs
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Prueba de controlador
const test = (req, res) => {
    res.status(200).json({
        message: "Soy una acción de prueba del controlador de artículos",
    });
};

// Prueba con datos ficticios
const course = (req, res) => {
    res.status(200).json([
        { curso: "Master en React", autor: "Roberto Castillo", url: "robertocastillo.cl" },
        { curso: "Master en Angular", autor: "Pablo Castillo", url: "pablocastillo.cl" },
    ]);
};

// Crear artículo
const postArticle = (req, res) => {
    const parameters = req.body;
    try {
        validateArticle(parameters); // Validación de datos
    } catch (error) {
        return res.status(400).json({ status: "error", message: error.message });
    }

    const article = new Article({
        title: parameters.title,
        content: parameters.content,
        image: parameters.image || "default.png",
    });

    article.save((error, savedArticle) => {
        if (error || !savedArticle) {
            return res.status(500).json({
                status: "error",
                message: "No se pudo guardar el artículo",
            });
        }
        res.status(200).json({
            status: "success",
            article: savedArticle,
            message: "¡Artículo creado con éxito!",
        });
    });
};

// Listar artículos (con o sin límite)
const listArticles = (req, res) => {
    const limit = parseInt(req.params.ultimos, 10);
    let query = Article.find().sort("-date");
    if (!isNaN(limit) && limit > 0) query = query.limit(limit);

    query.exec((error, articles) => {
        if (error || !articles.length) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron artículos",
            });
        }
        res.status(200).json({ status: "success", count: articles.length, articles });
    });
};

// Obtener artículo por ID
const getArticle = (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: "error", message: "ID no válido" });
    }

    Article.findById(id, (error, article) => {
        if (error || !article) {
            return res.status(404).json({ status: "error", message: "Artículo no encontrado" });
        }
        res.status(200).json({ status: "success", article });
    });
};

// Eliminar artículo
const deleteArticle = (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: "error", message: "ID no válido" });
    }

    Article.findOneAndDelete({ _id: id }, (error, deletedArticle) => {
        if (error || !deletedArticle) {
            return res.status(404).json({
                status: "error",
                message: "Artículo no encontrado",
            });
        }
        res.status(200).json({
            status: "success",
            article: deletedArticle,
            message: "¡Artículo eliminado con éxito!",
        });
    });
};

// Actualizar artículo
const putArticle = (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ status: "error", message: "ID no válido" });
    }

    try {
        validateArticle(req.body);
    } catch (error) {
        return res.status(400).json({ status: "error", message: error.message });
    }

    Article.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true, runValidators: true },
        (error, updatedArticle) => {
            if (error || !updatedArticle) {
                return res.status(404).json({
                    status: "error",
                    message: "Artículo no encontrado o error al actualizar",
                });
            }
            res.status(200).json({ status: "success", article: updatedArticle });
        }
    );
};

// Subir imagen
const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: "error", message: "Archivo no proporcionado" });
    }

    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    const validExtensions = ["png", "jpg", "jpeg", "gif"];
    if (!validExtensions.includes(fileExtension)) {
        fs.unlink(req.file.path, () => {});
        return res.status(400).json({ status: "error", message: "Extensión no válida" });
    }

    const { id } = req.params;
    Article.findOneAndUpdate(
        { _id: id },
        { image: req.file.filename },
        { new: true },
        (error, updatedArticle) => {
            if (error || !updatedArticle) {
                return res.status(404).json({
                    status: "error",
                    message: "Error al actualizar o artículo no encontrado",
                });
            }
            res.status(200).json({ status: "success", article: updatedArticle });
        }
    );
};

// Buscar artículos por texto
const seeker = (req, res) => {
    const search = req.params.busqueda;
    Article.find({
        $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
        ],
    })
        .sort("-date")
        .exec((error, articles) => {
            if (error || !articles.length) {
                return res.status(404).json({
                    status: "error",
                    message: "No se encontraron artículos",
                });
            }
            res.status(200).json({ status: "success", articles });
        });
};

module.exports = {
    test,
    course,
    postArticle,
    listArticles,
    getArticle,
    deleteArticle,
    putArticle,
    uploadImage,
    seeker,
};
