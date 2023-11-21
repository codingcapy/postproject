// const { ensureAuthenticated } = require("../middleware/checkAuth");
import express from "express";
import * as database from "../controller/postController";
import { sortPostBy } from "../utils/helperFunctions";
const router = express.Router();

router.get("/list", async (req, res) => {
  const subs = (await database.getSubs()).sort();
  const user = await req.user;
  res.render("subs", {subs, user});
});

router.get("/show/:subname", async (req, res) => {
  const subName = await req.params.subname;
  let posts = await database.getPosts(20, subName)
  let sortBy = (req.query.sortBy as string) || "date";
  [posts, sortBy] = sortPostBy(posts, sortBy);
  const user = await req.user;
  res.render("sub", {posts, subName, sortBy, user});
});

export default router;
