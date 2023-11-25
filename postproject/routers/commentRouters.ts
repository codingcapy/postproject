import express from "express";
import * as database from "../controller/commentController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { canEditComment, isLoggedIn } from "../utils/helperFunctions";

router.get("/show/:commentid", async (req, res) => {
  const commentId = req.params.commentid;
  const comment = await database.getComment(Number(commentId));
  const user = await req.user;
  const loggedIn = isLoggedIn(user);
  if (comment) {
    const canEdit = canEditComment(comment, user);
    res.render("individualComment", { comment, canEdit, loggedIn, user });
  } else {
    res.status(404);
    res.render("individualComment", { comment, loggedIn, user });
  }
});

router.post("/reply/:commentid", ensureAuthenticated, async (req, res) => {});

router.get("/edit/:commentid", ensureAuthenticated, async (req, res) => {
  const commentId = req.params.commentid;
  const comment = await database.getComment(Number(commentId));
  const user = await req.user;
  const loggedIn = isLoggedIn(user);
  if (comment) {
    const canEdit = canEditComment(comment, user);
    if (canEdit) res.render("editComment", { comment, loggedIn, user });
    else res.redirect("/posts/show/" + comment.post_id);
  } else {
    res.status(404);
    res.render("individualComment", { comment, loggedIn, user });
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
      if (canEdit) res.render("deleteComments", { comment });
      else res.redirect("/");
    } else {
      res.status(404);
      res.render("individualPost", {
        user,
        comment,
        loggedIn,
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
    });
  }
});

export default router;
