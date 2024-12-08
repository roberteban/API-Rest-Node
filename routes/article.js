const express = require("express"); 
const multer = require("multer"); 
const articleController = require("../controllers/article");
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './images/articles/')
    },
    filename: function(req, file, cb){
        cb(null, "article"+ Date.now() + file.originalname);
    },
}) 

const uploads = multer({storage: storage});

// Ruta de prueba
router.get("/ruta-de-prueba", articleController.test);
router.get("/curso", articleController.course);

// Ruta útil
router.post("/crear", articleController.postArticle);
// Obtener todos los ultimos artículos
router.get("/articulos/:ultimos?", articleController.listArticles);
router.get("/articulo/:id", articleController.getArticle);
router.delete("/articulo/:id", articleController.deleteArticle);
router.put("/articulo/:id", articleController.putArticle);
router.post("/subir-imagen/:id", [uploads.single("file0")], articleController.uploadImage);
router.get("/imagen/:fichero", articleController.image);
router.get("/buscar/:busqueda", articleController.seeker);

module.exports = router;



































