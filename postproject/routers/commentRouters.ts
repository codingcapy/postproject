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
    const canEdit = canEditComment(comment.creator, user);
    res.render("individualComment", { comment, canEdit, loggedIn });
  } else {
    res.render("individualComment", { comment, loggedIn });
  }
});

router.post("/reply/:commentid", ensureAuthenticated, async (req, res) => {});

router.get("/edit/:commentid", ensureAuthenticated, async (req, res) => {});

router.post("/edit/:commentid", ensureAuthenticated, async (req, res) => {});

router.get("/deleteconfirm/:commentid", ensureAuthenticated, async (req, res) => {});

router.post("/delete/:commentid", ensureAuthenticated, async (req, res) => {});

export default router;
