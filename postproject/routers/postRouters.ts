// // @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { canEditPost, isLoggedIn } from "../utils/helperFunctions";

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
  const creator = await Promise.resolve(req.user).then((user) => user!.id);
  console.log(newPost);
  console.log(creator);
  const title = newPost.title;
  const link = newPost.link;
  const description = newPost.description;
  const subgroup = newPost.subgroup;
  await database.createPost(title, link, creator, description, subgroup);
  const posts = await database.getPosts(20);
  const user = await req.user;
  res.status(200).render("posts", { posts, user });
});

router.get("/show/:postid", async (req, res) => {
  // ⭐ TODO
  // added by PK on 2023 11 30 3:09PM
  const postId = req.params.postid;
  const post = await database.getPost(postId);
  const comments = await database.getCommentsByPostId(Number(postId));
  const user = await req.user;
  const timestamp = new Date(post.timestamp);
  const canEdit = canEditPost(post.creator.id, user);
  const loggedIn = isLoggedIn(user);

  res.render("individualPost", {
    post,
    comments,
    timestamp,
    canEdit,
    loggedIn,
  });
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO - David
  const post = await database.getPost(req.params.postid);
  const user = await req.user;
  const canEdit = canEditPost(post.creator.id, user);
  if (canEdit) res.render("editPost", { post });
  else res.redirect("/");
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO - David
  const incomingEdits = await req.body;
  const user = await req.user;
  const postId = Number(req.params.postid);
  if (await database.editPost(postId, user!.id, incomingEdits)) {
    res.status(200);
    res.redirect("/");
  } else {
    res.status(403);
    res.redirect("/");
  }
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  const post = await database.getPost(req.params.postid);
  const user = await req.user;
  const canEdit = canEditPost(post.creator.id, user);
  if (canEdit) res.render("deletePosts", { post });
  else res.redirect("/");
  // ⭐ TODO
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
  const post = await database.getPost(req.params.postid);
  await database.deletePost(post.id);
  res.redirect("/");
});

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // ⭐ TODO - David
    const incomingComment = await req.body.newComment;
    const user = await req.user;
    const postId = Number(req.params.postid);
    const addedComment = await database.addComment(
      postId,
      user!.id,
      incomingComment
    );
    if (incomingComment == addedComment.description) {
      res.status(200);
      res.redirect("/posts/show/" + postId);
    } else {
      res.status(500);
      res.redirect("/posts/show/" + postId);
    }
  }
);

export default router;
