require("dotenv").config();
const express = require("express"),
  app = express(),
  //router = express.Router(),
  layouts = require("express-ejs-layouts"),
  session = require("express-session"),
  flash = require('connect-flash'),
  passport = require("passport"),
  LocalStrategy = require('passport-local').Strategy,
  db = require("./models/index"),
  homeRouter = require("./routes/homepage"),
  userRouter = require("./routes/userRouter"),
  accountRouter = require("./routes/accounts"),
  articleRouter = require("./routes/articles"),
  commentRouter = require("./routes/comments"),
  emailVerificationRouter = require("./routes/emailVerificationRouter"),
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
app.use(flash());

// set passport
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// passport LocalStrategy/serializeUser/deserializeUser 구현
// 10주차 강의안 107p의 코드는 mongoose를 쓰는 경우에만 사용가능하다고 해서,
// gpt한테 받은 코드입니다. 잘못되었거나 비효율적인 문장이 있을 수 있습니다.
passport.use(new LocalStrategy(
  async (id, password, done) => {
    try {
      const user = await db.User.findOne({ where: { id } });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});
passport.deserializeUser(async (user_id, done) => {
  try {
    const user = await db.User.findByPk(user_id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// db 수정이 없는 경우 : alert true인 채로 계속 돌리다 보면 오류 납니다.
db.sequelize.sync();
// db 수정이 있는 경우 : sequelize 바꾸면 이걸로 바꿔서 동기화
// db.sequelize.sync({ alter: true }); 

// set local data
app.use(async (req, res, next) => {
  try {
    // about flash message
    res.locals.flashMessages = req.flash();

    // about login session
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;

    // about comment alerts
    res.locals.commentalerts = [];
    res.locals.isThereNewAlert = false;

    if (res.locals.loggedIn) {
      const alerts = await db.CommentAlert.findAll({
        where: { user_id: res.locals.currentUser.user_id }
      });
      res.locals.commentalerts = alerts;
      res.locals.isThereNewAlert = await alerts.forEach(alr => {
        if (alr.is_checked === 'N')
          return true;
      });
    }

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
app.use("/email-verification", emailVerificationRouter);

app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log("실행 중");
});
