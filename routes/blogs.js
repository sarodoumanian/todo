import express from "express";
import multer from "multer";
import { mustBeSignedIn, mustBeSignedOut } from "../helpers/auth.js";
import { db } from "../helpers/blogHelper.js";
const router = express.Router();

const multerConfig = {
  storage: multer.diskStorage({
    //Setup where the user's file will go
    destination: function (req, file, next) {
      next(null, "uploads/");
    },

    //Then give the file a unique name
    filename: function (req, file, next) {
      const ext = file.mimetype.split("/")[1];
      next(null, +Date.now() + "." + file.originalname);
    },
  }),

  //A means of ensuring only images are uploaded.
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith("image/");
    if (image) {
      console.log("photo uploaded");
      next(null, true);
    } else {
      console.log("file not supported");

      return next();
    }
  },
};

router.post("/createBlog", mustBeSignedIn, multer(multerConfig).single("photo"), async (req, res) => {
  const { title, description } = req.body;
  try {
    if (req.file) {
      console.log(req.file);
      const created = await db.createBlog(title, description, req.file.filename, req.user.id);
      if (created) res.json("blog created");
    } else {
      res.json("file not supported");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// router.post("/comment/:blogId", mustBeSignedIn, async (req, res) => {
//   const { comment } = req.body;
//   const { blogId } = req.params;

//   try {
//     const commentCreated = await db.createComment(comment, blogId, req.user.id);
//     if (commentCreated) res.json("comment created");
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// });

export default router;
