require("dotenv").config();
const express = require("express"),
  app = express(),
  router = express.Router(),
  layouts = require("express-ejs-layouts"),
  session = require("express-session"),
  flash = require('connect-flash'),
  passport = require("passport"),
  db = require("./models/index"),
  homeRouter = require("./routes/homepage"),
  userRouter = require("./routes/userRouter"),
  accountRouter = require("./routes/accounts"),
  articleRouter = require("./routes/articles"),
  commentRouter = require("./routes/comments"),
  errorController = require("./controllers/errorController"),
  sseRoutes = require('./routes/sseRoutes'),
  alertRoutes = require('./routes/alertRoutes');

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

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use(passport.initialize());
app.use(passport.session());

db.sequelize.sync();
// db.sequelize.sync({ alter: true });  // sequelize 바꾸면 이걸로 바꿔서 동기화

// set local data
app.use(async (req, res, next) => {
  try {
    // about login session : 로그인 세션 구현 후 주석 해제
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;

    // about comment alerts : 로그인 세션 구현 후 아래 코드로 변경
    res.locals.commentalerts = await db.CommentAlert.findAll();
    res.locals.isThereNewAlert = false;

    //    res.locals.commentAlerts = await db.CommentAlert.findAll({
    //        where: { user_id: currentUser }
    //    });
    //    commentAlerts.forEach(alr => {
    //        if(alr.is_checked === 'N')
    //            return isThereNewAlert = true;
    //    });

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
app.use('/alerts', alertRoutes);

app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log("실행 중");
});
