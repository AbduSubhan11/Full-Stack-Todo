import { Todo } from "../models/todo";

export const setTodos = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const userId = req.user._id;
  if (!userId) {
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    const todo = new Todo({ title, description, userId });
    await todo.save();
    return res.status(201).json({ message: "Todo created successfully", todo });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const allTodos = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    const todos = await Todo.find({ userId });
    if (!todos) {
      return res.status(404).json({ message: "No todos found" });
    }
    return res
      .status(200)
      .json({ message: "Todos fetched successfully", todos });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user._id;
  if (!todoId) {
    return res.status(400).json({ message: "Todo ID is required" });
  }
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const todo = await Todo.findByIdAndDelete({ _id: todoId, userId });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    return res.status(200).json({ message: "Todo deleted successfully", todo });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTodo = async (req,res)=>{
    const todoId = req.params.id;
    const { title, description } = req.body;
    const userId = req.user._id;
    if (!todoId) {
      return res.status(400).json({ message: "Todo ID is required" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!title || !description) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    try {
        const updateTodo =await Todo.findByIdAndUpdate({
            _id: todoId,
            userId
        }, {
            title,
            description
        }, {
            new: true,
        })

        if (!updateTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        return res.status(200).json({ message: "Todo updated successfully", updateTodo });
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
        
    }
}


