import dotenv from "dotenv";
dotenv.config();

import { pool } from "../app.js";

const db = {};

db.createBlog = (title, description, imagePath, user_id) => {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO blog(title, description, img, user_id) VALUES(?,?,?,?)", [title, description, imagePath, user_id], (err, result) => {
      if (err) return reject(err);
      if (result) {
        resolve(result);
      }
    });
  });
};

// db.createComment = (comment, blog_id, user_id) => {
//   return new Promise((resolve, reject) => {
//     pool.query("INSERT INTO blog_comment(comment, blog_id, user_id) VALUES(?,?,?)", [comment, blog_id, user_id], (err, result) => {
//       if (err) return reject(err);
//       if (result) {
//         resolve(result);
//       }
//     });
//   });
// };

export { db };
