import express from "express";
import passport from "../middleware/passport";
import { forwardAuthenticated } from "../middleware/checkAuth";
const router = express.Router();

router.get("/login", forwardAuthenticated, async (req, res) => {
  const messages = req.session.messages || [];
  const user = await req.user;
  res.render("login", { messages: messages.pop(), user, active: "login", });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/auth/login",
    failureMessage: true,
  })
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
});

export default router;
