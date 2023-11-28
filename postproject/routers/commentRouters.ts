import express from "express";
import * as database from "../controller/commentController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { canEditComment, canEditReply, isLoggedIn } from "../utils/helperFunctions";

router.get("/show/:commentid", async (req, res) => {
  const commentId = req.params.commentid;
  const comment = await database.getComment(Number(commentId));
  const replies = await database.getReplies(Number(commentId));
  const user = await req.user;
  const loggedIn = isLoggedIn(user);
  if (comment) {
    const canEdit = canEditComment(comment, user);
    res.render("individualComment", { comment, canEdit, loggedIn, user, active: "none", replies });
  } else {
    res.status(404);
    res.render("individualComment", { comment, loggedIn, user, active: "none", });
  }
});

router.post("/reply/:commentid", ensureAuthenticated, async (req, res) => {
  const incomingReply = await req.body.newReply;
  const user = await req.user;
  const commentId = Number(req.params.commentid);
  console.log(req.params.commentid);
  const addedReply = await database.addReply(
    commentId,
    user!.id,
    incomingReply
  );
  if (incomingReply == addedReply.description) {
    res.status(200);
    res.redirect("/comments/show/" + commentId);
  } else {
    res.status(500);
    res.redirect("/comments/show/" + commentId);
  }
});

router.get(
  "/reply/deleteconfirm/:replyid",
  ensureAuthenticated,
  async (req, res) => {
    const reply = await database.getReply(Number(req.params.replyid));
    const comment = await database.getComment(Number(reply?.comment_id));
    const user = await req.user;
    const loggedIn = isLoggedIn(user);
    if (reply) {
      const canEdit = canEditReply(reply, user);
      if (canEdit) res.render("deleteReply", { reply, user, active: "none", });
      else res.redirect("/");
    } else {
      res.status(404);
      res.render("individualComment", {
        user,
        comment,
        loggedIn,
        active: "none",
      });
    }
  }
);

router.post("/reply/delete/:replyid", ensureAuthenticated, async (req, res) => {
  const reply = await database.getReply(Number(req.params.replyid));
  const comment = await database.getComment(Number(reply?.comment_id));
  const user = await req.user;
  const loggedIn = isLoggedIn(user);
  if (reply) {
    await database.deleteReply(reply.id);
    res.redirect("/");
  } else {
    res.status(404);
    res.render("individualPost", {
      comment,
      loggedIn,
      user,
      active: "none",
    });
  }
});

router.get("/reply/edit/:replyid", ensureAuthenticated, async (req, res) => {
  const replyId = req.params.replyid;
  const reply = await database.getReply(Number(replyId));
  const comment = await database.getComment(Number(reply?.comment_id));
  const user = await req.user;
  const loggedIn = isLoggedIn(user);
  if (reply) {
    const canEdit = canEditReply(reply, user);
    if (canEdit) res.render("editReply", { reply, loggedIn, user, active: "none", });
    else res.redirect("/comments/show/" + comment!.id);
  } else {
    res.status(404);
    res.render("individualComment", { comment, loggedIn, user, active: "none", });
  }
});

router.post("/reply/edit/:replyid", ensureAuthenticated, async (req, res) => {
  const incomingEdits = await req.body;
  const user = await req.user;
  const replyId = req.params.replyid;
  await database.editReply(Number(replyId), incomingEdits);
  const reply = await database.getReply(Number(replyId));
  res.redirect("/comments/show/" + reply!.comment_id);
});

router.get("/edit/:commentid", ensureAuthenticated, async (req, res) => {
  const commentId = req.params.commentid;
  const comment = await database.getComment(Number(commentId));
  const user = await req.user;
  const loggedIn = isLoggedIn(user);
  if (comment) {
    const canEdit = canEditComment(comment, user);
    if (canEdit) res.render("editComment", { comment, loggedIn, user, active: "none", });
    else res.redirect("/posts/show/" + comment.post_id);
  } else {
    res.status(404);
    res.render("individualComment", { comment, loggedIn, user, active: "none", });
  }
});

router.post("/edit/:commentid", ensureAuthenticated, async (req, res) => {
  const incomingEdits = await req.body;
  const user = await req.user;
  const commentId = req.params.commentid;
  await database.editComment(Number(commentId), incomingEdits);
  const comment = await database.getComment(Number(commentId));
  res.redirect("/posts/show/" + comment!.post_id);
});

router.get(
  "/deleteconfirm/:commentid",
  ensureAuthenticated,
  async (req, res) => {
    const comment = await database.getComment(Number(req.params.commentid));
    const user = await req.user;
    const loggedIn = isLoggedIn(user);
    if (comment) {
      const canEdit = canEditComment(comment, user);
      if (canEdit) res.render("deleteComments", { comment, user, active: "none", });
      else res.redirect("/");
    } else {
      res.status(404);
      res.render("individualPost", {
        user,
        comment,
        loggedIn,
        active: "none",
      });
    }
  }
);

router.post("/delete/:commentid", ensureAuthenticated, async (req, res) => {
  const comment = await database.getComment(Number(req.params.commentid));
  const user = await req.user;
  const loggedIn = isLoggedIn(user);
  if (comment) {
    await database.deleteComment(comment.id);
    res.redirect("/");
  } else {
    res.status(404);
    res.render("individualPost", {
      comment,
      loggedIn,
      user,
      active: "none",
    });
  }
});

export default router;
