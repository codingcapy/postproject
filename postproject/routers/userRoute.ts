import express from "express";
import * as database from "../controller/userController";

const router = express.Router()

router.get("/", async (req, res) => {
    res.render("signup");
})

router.post("/", async (req, res) => {
    const newUser = await req.body;
    const uname = newUser.uname;
    const password = newUser.password
    await database.createUser(uname, password)
    res.render("login")
})

export default router;