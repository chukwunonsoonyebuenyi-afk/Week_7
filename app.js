require('dotenv').config();

const express = require('express');
const Joi = require('joi');
const cors = require('cors');

// IMPORT MIDDLEWARES
const logRequest = require('./middlewares/logger');
const validatePost = require('./middlewares/validatePost');
const validatePatch = require('./middlewares/validatePatch');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./database/db');
const Todo = require('./models/todo.model');

const app = express();
const PORT = process.env.PORT;

// GLOBAL MIDDLEWARES
app.use(express.json());
app.use(logRequest);
app.use(cors());
connectDB();

// GET ALL TODOS
app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.status(200).json({
        success: true,
        data: todos
    });
});

// GET COMPLETED TODOS
app.get('/todos/completed', async (req, res) => {
try {

    const completedTodos = await Todo.find({ completed: true });

    res.status(200).json({
        success: true,
        data: completedTodos
    });
} catch (error) {
    next(error);
}
});

// GET TODO BY ID
app.get('/todos/:id', async (req, res) => {
   try {

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        return res.status(404).json({
            success: false,
            message: 'Todo not found'
        });
    }

    res.status(200).json({
        success: true,
        data: todo
    });
} catch (error) {
    next(error);
}
});

// POST CREATE TODO
app.post('/todos', validatePost, async (req, res, next) => {
    
    const { task, completed } = req.body;
    const newTodo = new Todo({
        task,
        completed
    });
    
    await newTodo.save();
    try {
   
        res.status(201).json({
            success: true,
            message: 'Todo created successfully',
            data: newTodo
        });
    } catch (error) {
        next(error);
    }
});

// PATCH UPDATE TODO
app.patch('/todos/:id', validatePatch, async (req, res, next) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        if (req.body.task !== undefined) {
            todo.task = req.body.task;
        }

        if (req.body.completed !== undefined) {
            todo.completed = req.body.completed;
        }

        res.status(200).json({
            success: true,
            message: 'Todo updated successfully',
            data: todo
        });
    } catch (error) {
        next(error);
    }
});

// DELETE TODO
app.delete('/todos/:id', async (req, res) => {
try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
        return res.status(404).json({
            success: false,
            message: 'Todo not found'
        });
    }

    res.status(200).json({
        success: true,
        message: `Todo ${req.params.id} deleted`,
    });
} catch (error) {
    next(error);
}
});

// GLOBAL ERROR HANDLER (MUST BE LAST)
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});