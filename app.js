import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mysql from "mysql";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/upload", express.static("uploads"));

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(cookieParser());

pool.getConnection((err, con) => {
  if (err) return console.log(err);
  console.log("connected to db...");
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

import userRouter from "./routes/user.js";
app.use(userRouter);

import blogRouter from "./routes/blogs.js";
app.use(blogRouter);

app.listen(process.env.PORT, () => {
  console.log("server started");
});

export { pool };
