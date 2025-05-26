const db = require("../models");
const User = db.User;
const crypto = require("crypto");

// 유저 파라미터 추출
function getUserParams(body) {
  return {
    id: body.id,
    password: body.password,
    email: body.email,
    name: body.name,
    level_id: 1,
    email_verified: "N"
    };
}

// 이메일로 유저 찾기
const findUserById = async (email) => {
  return await User.findOne({ where: { email } });
};

// 회원가입 처리
const create = (req, res, next) => {
  console.log("비밀번호:", req.body.password);
  console.log("비밀번호 확인:", req.body.confirmPassword);

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash("error", "비밀번호와 비밀번호 확인이 일치하지 않습니다.");

    return res.render("new", {
      name: req.body.name,
      id: req.body.id,
      email: req.body.email,
      password,
      confirmPassword,
      messages: req.flash()
    });
  }

  const userParams = getUserParams(req.body);

  User.create(userParams)
    .then(user => {
      req.flash("success", `${user.name}님의 회원가입이 완료되었습니다.`);
      res.locals.redirect = "/users/login";
      res.locals.user = user;
      next();
    })
    .catch(error => {
      console.error(`Error saving user: ${error.message}`);
      req.flash("error", error.message);
      return res.render("new", {
        name: req.body.name,
        id: req.body.id,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        messages: req.flash()
      });
    });
};

// 로그인 폼
const login = (req, res) => {
  res.render("login");
};

// 로그인 인증 처리
const authenticate = (req, res, next) => {
  User.findOne({ where: { id: req.body.id } })
    .then(user => {
      if (!user) {
        req.flash("error", "존재하지 않는 계정입니다.");
        res.locals.redirect = "/users/login";
        return next();
      }
      return user.passwordComparison(req.body.password)
        .then(match => {
          if (!match) {
            req.flash("error", "틀린 비밀번호입니다.");
            res.locals.redirect = "/users/login";
          } else {
            req.flash("success", `${user.name}님이 로그인하셨습니다.`);
            res.locals.redirect = `/users/${user.id}`;
            res.locals.user = user;
          }
          next();
        });
    })
    .catch(error => {
      console.error(`${error.message}로 인해 로그인에 실패했습니다.`);
      next(error);
    });
};

// 로그아웃
const logout = (req, res, next) => {
  req.session.destroy(() => next());
};

// 리다이렉션 처리
const redirectView = (req, res) => {
  res.redirect(res.locals.redirect);
};

// 이메일 인증 코드 발송
const sendResetEmail = async (req, res, next) => {
  console.log("RESET 요청 도착");
  const { email, name, id, password, confirmPassword } = req.body;

  res.locals.email = email;
  res.locals.name = name;
  res.locals.id = id;
  res.locals.password = password;
  res.locals.confirmPassword = confirmPassword;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("유저 없음 - 인증코드 생성만 수행");

      const code = crypto.randomInt(100000, 999999).toString();
      console.log("생성된 인증코드:", code);

      req.flash("success", `입력한 이메일로 콘솔에 인증코드를 보냈습니다.`);
      res.locals.redirect = "/users/new";
      return next();
    } else {
      req.flash("error", "이미 가입된 이메일입니다.");
      res.locals.redirect = "/users/new";
      return next();
    }
  } catch (error) {
    console.error("인증코드 발송 오류:", error.message);
    req.flash("error", "인증코드 발송 중 오류 발생");
    res.locals.redirect = "/users/new";
    return next();
  }
};

// 인증코드 검증
const verifyAuthCode = async (req, res, next) => {
  const { email, emailCode } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || user.authCode !== emailCode) {
      req.flash("error", "잘못된 인증코드입니다.");
      res.locals.redirect = "/users/reset-password";
      return next();
    }

    req.flash("success", "인증 성공! 비밀번호를 재설정하세요.");
    res.locals.user = user;
    res.locals.redirect = "/users/reset-form";
    next();
  } catch (err) {
    console.error(err.message);
    req.flash("error", "인증 도중 오류가 발생했습니다.");
    res.locals.redirect = "/users/reset-password";
    next();
  }
};

// 비밀번호 재설정 폼
const showResetForm = (req, res) => {
  res.render("resetPassword2");
};

// 최종 비밀번호 변경 처리
const resetPasswordFinal = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash("error", "비밀번호와 확인이 일치하지 않습니다.");
    res.locals.redirect = "/users/reset-form";
    return next();
  }

  findUserById(email)
    .then(user => {
      if (!user) {
        req.flash("error", "존재하지 않는 계정입니다.");
        res.locals.redirect = "/users/login";
        return next();
      }
      user.password = password;
      return user.save().then(() => {
        req.flash("success", "비밀번호가 성공적으로 변경되었습니다.");
        res.locals.redirect = "/users/login";
        next();
      });
    })
    .catch(error => {
      console.error(`Error resetting password: ${error.message}`);
      req.flash("error", `${error.message}로 인해 비밀번호 변경에 실패했습니다.`);
      res.locals.redirect = "/users/reset-form";
      next();
    });
};

// 이메일 인증 상태 업데이트
const verifyEmail = (req, res, next) => {
  const { userId, status } = req.body;
  updateEmailVerifiedStatus(userId, status)
    .then(() => {
      req.flash("success", "이메일 인증 상태가 업데이트되었습니다.");
      res.locals.redirect = "/users/login";
      next();
    })
    .catch(error => {
      console.error(`Error verifying email: ${error.message}`);
      req.flash("error", `${error.message}로 인해 인증 상태 업데이트에 실패했습니다.`);
      res.locals.redirect = "/users/login";
      next();
    });
};

// 회원가입 폼 렌더링
const showSignupForm = (req, res) => {
  res.render("new", {
    email: res.locals.email || "",
    name: res.locals.name || "",
    id: res.locals.id || "",
    password: res.locals.password || "",
    confirmPassword: res.locals.confirmPassword || "",
    messages: req.flash()
  });
};

// 인증코드 요청 폼 렌더링
const showResetRequestForm = (req, res) => {
  res.render("resetPassword");
};

module.exports = {
  create,
  login,
  authenticate,
  logout,
  redirectView,
  sendResetEmail,
  showResetForm,
  resetPasswordFinal,
  verifyEmail,
  showSignupForm,
  showResetRequestForm,
  verifyAuthCode
};
