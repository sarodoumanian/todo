import dotenv from "dotenv";
dotenv.config();
import { v4 } from "uuid";

import { pool } from "../app.js";

const db = {};

db.createUser = (username, password) => {
  return new Promise((resolve, reject) => {
    pool.query(`INSERT INTO user VALUES(?,?,?)`, [v4(), username, password], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

db.findByUsername = (username) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM user WHERE username = ?`, [username], (err, res) => {
      if (err) return reject(err);
      resolve(res[0]);
    });
  });
};

db.createTask = (task, user_id) => {
  return new Promise((resolve, reject) => {
    pool.query(`INSERT INTO todo(task, user_id) VALUES(?,?)`, [task, user_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

db.findAllTodosByUserid = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM todo WHERE user_id=?`, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

db.findTodoById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM todo WHERE id=?`, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

db.updateTodo = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE todo SET completed=1 WHERE id=?`, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

export { db };
