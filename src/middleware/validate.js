const { validationResult } = require("express-validator");

function validate(req, res, next){
    const result = validationResult(req);

    if (result.isEmpty()){
        return next();
    }

    const errors = result.array().map((e) => ({
        field: e.path,
        message: e.msg
    }));

    return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors
    });
}

module.exports = validate;