// // @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { canEditPost, isLoggedIn, sortPostBy } from "../utils/helperFunctions";

router.get("/", async (req, res) => {
  let posts = await database.getPosts(20);
  const user = await req.user;
  let sortBy = (req.query.sortBy as string) || "date";
  [posts, sortBy] = sortPostBy(posts, sortBy);
  res.render("posts", { posts, user, sortBy });
});

router.get("/create", ensureAuthenticated, async (req, res) => {
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
  const postId = Number(req.params.postid);
  const post = await database.getPost(postId);
  const comments = await database.getCommentsByPostId(Number(postId));
  const user = await req.user;
  const loggedIn = isLoggedIn(user);

  if (post) {
    const timestamp = new Date(post.timestamp);
    const canEdit = canEditPost(post, user);

    res.render("individualPost", {
      user,
      post,
      comments,
      timestamp,
      canEdit,
      loggedIn,
    });
  } else {
    res.status(404);
    res.render("individualPost", {
      post,
      loggedIn,
    });
  }
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO - David
  const post = await database.getPost(Number(req.params.postid));
  const user = await req.user;
  const loggedIn = isLoggedIn(user);
  if (post) {
    const canEdit = canEditPost(post, user);
    if (canEdit) res.render("editPost", { post });
    else res.redirect("/");
  } else {
    res.status(404);
    res.render("individualPost", {
      post,
      loggedIn,
    });
  }
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO - David
  const incomingEdits = await req.body;
  const user = await req.user;
  const postId = Number(req.params.postid);
  if (await database.editPost(postId, user!.id, incomingEdits)) {
    res.status(200);
    res.redirect("/posts/show/" + postId);
  } else {
    res.status(403);
    res.redirect("/posts/show/" + postId);
  }
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  const post = await database.getPost(Number(req.params.postid));
  const user = await req.user;
  const loggedIn = isLoggedIn(user);
  if (post) {
    const canEdit = canEditPost(post, user);
    if (canEdit) res.render("deletePosts", { post });
    else res.redirect("/");
  } else {
    res.status(404);
    res.render("individualPost", {
      user,
      post,
      loggedIn,
    });
  }
  // ⭐ TODO
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
  const post = await database.getPost(Number(req.params.postid));
  const user = await req.user;
  const loggedIn = isLoggedIn(user);
  if (post) {
    await database.deletePost(post.id);
    res.redirect("/");
  } else {
    res.status(404);
    res.render("individualPost", {
      post,
      loggedIn,
    });
  }
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
