import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../helpers/userHelper.js";
import { mustBeSignedIn, mustBeSignedOut } from "../helpers/auth.js";
const router = express.Router();

router.post("/createUser", mustBeSignedOut, async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await db.findByUsername(username);
    if (existingUser) return res.status(400).json("This user already exists try something else");
    const hashedPassword = await bcrypt.hash(password, 8);
    await db.createUser(username, hashedPassword);
    res.status(201).json("successfully created new user");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", mustBeSignedOut, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.findByUsername(username);
    if (!user) return res.json("username or password is incorrect");
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: "2h" });
      res.cookie("token", token, { httpOnly: true }).status(200).json(user);
    } else res.status(404).json("username or password is incorrect");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/createTodo", mustBeSignedIn, async (req, res) => {
  const { task } = req.body;
  try {
    const newTask = await db.createTask(task, req.user.id);
    if (newTask) res.status(201).json("todo created");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/allTodosByLoggedinUser", mustBeSignedIn, async (req, res) => {
  try {
    const todos = await db.findAllTodosByUserid(req.user.id);
    console.log(todos);
    res.status(200).json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// change completed to true
router.put("/todo/:id", mustBeSignedIn, async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await db.findTodoById(id);
    console.log(todo);
    if (!todo) return res.status(400).json("no todo with this id");

    if (todo.user_id === req.user.id) {
      await db.updateTodo(id);
      res.json("todo updated");
    } else {
      res.status(400).json("This todo doesn't belong to you and you cannot update it");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").json("logged out");
});

export default router;
