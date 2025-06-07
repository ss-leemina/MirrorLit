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
  articleRouter = require("./routes/articles"),
  commentRouter = require("./routes/comments"),
  emailVerificationRouter = require("./routes/emailVerificationRouter"),
  errorController = require("./controllers/errorController"),
  sseRoutes = require('./routes/sseRoutes'),
  alertRoutes = require('./routes/alertRoutes'),
  rankRouter = require('./routes/rank');

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

// passport LocalStrategy/serializeUser/deserializeUser
passport.use(new LocalStrategy(
  {
    usernameField: "id",
    passwordField: "password"
  },

  async (id, password, done) => {
    console.log("LocalStrategy 실행됨", id);
    try {
      const user = await db.User.findOne({ where: { id } });
      if (!user) {
        console.log("사용자 없음");
        return done(null, false, {
          message: "회원가입이 완료되지 않은 계정입니다. 먼저 가입을 진행해주세요."
        });
      }

      console.log("사용자 있음", user.user_id);
      user.passwordComparison(password, (err, result, info) => {
        console.log("in passwordComparison ######")
        if (err) return done(err);

        if (result === false) {
          console.log("비밀번호 불일치");
          return done(null, false, { message: "비밀번호가 틀렸습니다." });
        }
        else {
          console.log("로그인 성공, 사용자 ID:", user.user_id);
          return done(null, user);
        }
      });
    } catch (err) {
      console.error("LocalStrategy 에러:", err);
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  console.log("serializeUser 실행됨", user.user_id);
  done(null, user.user_id);
});


passport.deserializeUser(async (user_id, done) => {
  try {
    const user = await db.User.findByPk(user_id);

    // 강제 인스턴스로 변환
    if (user && typeof user.passwordComparison !== 'function') {
      passportLocalSequelize.attachToUser(user.constructor, {
        usernameField: "id",
        hashField: "myhash",
        saltField: "mysalt"
      });
    }

    console.log("deserializeUser 실행됨", user.id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


// db 수정이 없는 경우
db.sequelize.sync();
// db 수정이 있는 경우
// db.sequelize.sync({ alter: true });

// set local data
app.use(async (req, res, next) => {
  try {
    // about flash message
    res.locals.flashMessages = req.flash();

    // about login session
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;

    // about alerts
    res.locals.commentalerts = [];
    res.locals.isThereNewAlert = false;

    // 사용자가 로그인한 경우 알림 확인
    if (res.locals.loggedIn) {

      // 댓글 알림 확인
      const alerts = await db.CommentAlert.findAll({
        where: { user_id: res.locals.currentUser.user_id },
        order: [['alert_id', 'DESC']]
      });
      res.locals.commentalerts = alerts;

      // 새로운 댓글 알림이 있는지 확인
      res.locals.isThereNewAlert = await alerts.some(alr => alr.is_checked === 'N');

      // 사용자 알림 확인
      const notifications = await db.UserNotification.findAll({
        where: { user_id: res.locals.currentUser.user_id },
        order: [['notification_id', 'DESC']]
      });
      res.locals.commentalerts.push(...notifications);

      // 새로운 사용자 알림이 있는지 확인 (새로운 댓글 알림이 이미 있다면 확인하지 않음)
      if(res.locals.isThereNewAlert === false) {
        res.locals.isThereNewAlert = await notifications.some(ntf => ntf.is_checked === 'N');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// set routes
app.use("/users", userRouter);
app.use("/email-verification", emailVerificationRouter);
app.use("/", homeRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use('/sse', sseRoutes);
app.use('/alerts', alertRoutes);
app.use('/rank', rankRouter);

app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);



app.listen(app.get("port"), () => {
  console.log("실행 중");
});
