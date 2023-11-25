import express from "express";
import * as database from "../controller/userController";

const router = express.Router();

router.get("/", async (req, res) => {
  const user = await req.user;
  res.render("signup", { messages: "", user });
});

router.post("/", async (req, res) => {
  const newUser = await req.body;
  const uname = newUser.uname;
  const password = newUser.password;
  const user = await req.user;
  const unameExist = await database.getUserByUsername(uname);
  if (unameExist)
    res.render("signup", {
      messages: "Username already exists. Please try another username.",
      user,
    });
  else {
    await database.createUser(uname, password);
    res.render("login", {
      messages: "Successfully signed up. Please log in.",
      user,
    });
  }
});

export default router;
