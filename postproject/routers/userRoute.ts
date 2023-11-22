import express from "express";
import * as database from "../controller/userController";

const router = express.Router()

router.get("/", async (req, res) => {
    res.render("signup", { messages: "" });
})

router.post("/", async (req, res) => {
    const newUser = await req.body;
    const uname = newUser.uname;
    const password = newUser.password;
    const unameExist = await database.getUserByUsername(uname);
    if(unameExist) res.render("signup", { messages: "Username already exists. Please try another username." });
    else {
        await database.createUser(uname, password);
        res.render("login", {messages: "Successfully signed up. Please log in."});
    }
})

export default router;