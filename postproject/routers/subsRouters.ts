// const { ensureAuthenticated } = require("../middleware/checkAuth");
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();

router.get("/list", async (req, res) => {
  const subs = (await database.getSubs()).sort();
  res.render("subs", {subs});
});

router.get("/show/:subname", async (req, res) => {
  const subName = await req.params.subname;
  const posts = await database.getPosts(20, subName)
  res.render("sub", {posts, subName});
});

export default router;
