const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// middleware
app.use(bodyParser.json());
app.use(cors());

//Mongo DB connection
const MONGOURL = "mongodb+srv://jiteshsonar03:Vr5qMAyBwhvVckAR@cluster0.1qa2b.mongodb.net/todolist?retryWrites=true&w=majority&appName=Cluster0"
try {
  mongoose.connect(MONGOURL);
  console.log("connedcted MongoDB");
} catch (error) {
  console.log(error);
}

const todoSchem = new mongoose.Schema({
    title : String
})

const Todo = mongoose.model("Todo", todoSchem);

//CRUD
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.put("/todos/:id", async (req, res) => {
  try {
    const updateTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log("Server is running port on ", port);
});
