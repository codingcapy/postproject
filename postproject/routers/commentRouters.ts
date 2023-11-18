import express from "express";
import * as database from "../controller/commentController";
const router = express.Router();
import { isLoggedIn } from "../utils/helperFunctions";

router.get("/show/:commentid", async (req, res) => {
  const commentId = req.params.commentid;
  const comment = await database.getComment(Number(commentId));
  const user = await req.user;
  const loggedIn = isLoggedIn(user);
  if (comment) {
    const canEdit = comment.creator === user?.id || false;
    res.render("individualComment", { comment, canEdit, loggedIn });
  } else {
    res.render("individualComment", { comment, loggedIn });
  }
});

export default router;
