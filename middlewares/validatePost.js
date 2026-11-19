const Joi = require('joi');

const postSchema = Joi.object({
    task: Joi.string().min(3).required(),
    completed: Joi.boolean()
});

const validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body || {});

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};

module.exports = validatePost;