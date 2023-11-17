import express from "express";
import * as database from "../controller/commentController";
const router = express.Router();

declare global {
  namespace Express {
    interface User {
      id: number;
      uname: string;
      password: string;
    }
  }
}

router.get("/show/:commentid", async (req, res) => {
  const commentId = await req.params.commentid;
  const comment = await database.getComment(Number(commentId));
  const user = await req.user;
  const isLoggedIn = typeof user !== "undefined" ? true : false;
  const canEdit =
    typeof user !== "undefined" && (comment.creator == user.id)
      ? true
      : false;
  res.render("individualComment", { comment, canEdit, isLoggedIn });
});

export default router;
