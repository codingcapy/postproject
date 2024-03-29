import express from "express";
import session from "express-session";
import passport from "./middleware/passport";
import expressLayouts from "express-ejs-layouts"
const PORT = process.env.PORT || 8000;

const app = express();

app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // HTTPS Required
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

import indexRoute from "./routers/indexRoute";
import authRoute from "./routers/authRoute";
import postsRoute from "./routers/postRouters";
import subsRouters from "./routers/subsRouters";
import commentRouters from "./routers/commentRouters";
import userRoute from "./routers/userRoute";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressLayouts);

app.use("/auth", authRoute);
app.use("/posts", postsRoute);
app.use("/subs", subsRouters);
app.use("/comments", commentRouters);
app.use("/", indexRoute);
app.use("/users", userRoute);

app.listen(PORT, () =>
  console.log(`server should be running at http://localhost:${PORT}/`)
);
