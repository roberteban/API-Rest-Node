const { isEmpty, isLength } = require("validator");

// Función para validar un artículo
const validateArticle = (parameters) => {
    if (!parameters.title || isEmpty(parameters.title)) {
        throw new Error("El título no puede estar vacío");
    }
    if (!isLength(parameters.title, { min: 5 })) {
        throw new Error("El título debe tener al menos 5 caracteres");
    }
    if (!parameters.content || isEmpty(parameters.content)) {
        throw new Error("El contenido no puede estar vacío");
    }
};

module.exports = {
    validateArticle,
};
