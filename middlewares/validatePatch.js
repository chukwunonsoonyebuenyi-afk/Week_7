const Joi = require('joi');

const patchSchema = Joi.object({
    task: Joi.string().min(3),
    completed: Joi.boolean()
}).min(1);

const validatePatch = (req, res, next) => {
    const { error } = patchSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};

module.exports = validatePatch;