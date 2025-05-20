require("dotenv").config();

const express = require("express"),
  app = express(),
  router = express.Router(),
  layouts = require("express-ejs-layouts"),
  db = require("./models/index"),
  homeRouter = require("./routes/homepage"),
  userRouter = require("./routes/users"),
  accountRouter = require("./routes/accounts"),
  articleRouter = require("./routes/articles"),
  commentRouter = require("./routes/comments"),
  errorController = require("./controllers/errorController");
  userRoutes = require("./routes/userRoutes");
  sseRoutes = require('./routes/sseRoutes');

// set port
app.set("port", process.env.PORT || 3000);

// set view rendering
app.set("view engine", "ejs");
app.use(layouts);
app.use(express.static("public"));

app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());

app.use("/users", userRoutes);

db.sequelize.sync();
// db.sequelize.sync({ alter: true });  // sequelize 바꾸면 이걸로 바꿔서 동기화

// set local data
app.use(async (req, res, next) => {
  try {
    res.locals.commentalerts = await db.CommentAlert.findAll();	// 추후 수정
    next();
  } catch (error) {
    next(error);
  }
});

// set routes
//app.use("/users/:userid", accountRouter);
app.use("/users", userRouter);
app.use("/home", homeRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use('/sse', sseRoutes);

app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log("실행 중");
});
