const express = require("express");
const multer = require("multer");
const articleController = require("../controllers/article");
const router = express.Router();

// Configuración de almacenamiento para imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./images/articles/"),
    filename: (req, file, cb) => cb(null, "article_" + Date.now() + path.extname(file.originalname)),
});
const uploads = multer({ storage });

// Rutas
router.get("/prueba", articleController.test);
router.get("/curso", articleController.course);
router.post("/crear", articleController.postArticle);
router.get("/articulos/:ultimos?", articleController.listArticles);
router.get("/articulo/:id", articleController.getArticle);
router.delete("/articulo/:id", articleController.deleteArticle);
router.put("/articulo/:id", articleController.putArticle);
router.post("/subir-imagen/:id", uploads.single("file0"), articleController.uploadImage);
router.get("/buscar/:busqueda", articleController.seeker);

module.exports = router;
