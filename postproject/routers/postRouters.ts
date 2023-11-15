// @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";

router.get("/", async (req, res) => {
  const posts = await database.getPosts(20);
  const user = await req.user;
  res.render("posts", { posts, user });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts");
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
  // added by PK on 2023 11 30 3:09PM
  const newPost = await req.body;
  const creator = await Promise.resolve(req.user).then((user) => user.id);
  console.log(newPost);
  console.log(creator);
  const title = newPost.title;
  const link = newPost.link;
  const description = newPost.description;
  const subgroup = newPost.subgroup;
  await database.createPost(title, link, creator, description, subgroup);
  const posts = await database.getPosts(20);
  const user = await req.user;
  res.status(200).render("posts", { posts, user })
});

router.get("/show/:postid", async (req, res) => {
  // ⭐ TODO
  // added by PK on 2023 11 30 3:09PM
  const postId = req.params.postid
  const post = await database.getPost(postId)
  const user = await req.user;
  const timestamp = new Date(post.timestamp);
  const canEdit = (post.creator.id === user?.id) || false;

  res.render("individualPost", {post, timestamp, canEdit});
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO - David
  const post = await database.getPost(req.params.postid);
  const user = await req.user;
  if (user.id == post.creator.id) res.render("editPost", { post });
  else res.redirect("/");
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO - David
  const incomingEdits = await req.body;
  console.log(incomingEdits);
  const user = await req.user;
  const postId = req.params.postid;
  // Need to check what to do if user does not match creator
  if (database.editPost(postId, user.id, incomingEdits)) {
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  const post = await database.getPost(req.params.postid);
  const user = await req.user;
  if (user.id == post.creator.id) res.render("deletePosts", {post});
  else res.redirect("/");
  // ⭐ TODO
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
  const post = await database.getPost(req.params.postid);
  if (database.deletePost(post.id)) {
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // ⭐ TODO
  }
);

export default router;
