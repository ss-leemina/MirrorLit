const express = require("express"),
  app = express(),
  router = express.Router(),
  layouts = require("express-ejs-layouts"),
  homeRouter = require("./routes/homepage"),
  userRouter = require("./routes/users"),
  accountRouter = require("./routes/accounts"),
  articleRouter = require("./routes/articles"),
  errorController = require("./controllers/errorController");

// set port
app.set("port", process.env.PORT || 3000);

// set view rendering
app.set("view engine", "ejs");
app.use(layouts);
app.use(express.static("public"));

// set router
router.use(
  express.urlencoded({
    extended: false
  })
);
router.use(express.json());

//app.use("/users/:userid", accountRouter);
//app.use("/users", userRouter);
app.use("/articles", articleRouter);
app.use("/home", homeRouter);

app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log("실행 중");
});
