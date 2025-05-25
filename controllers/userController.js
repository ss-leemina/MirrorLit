const db = require("../models");
const User = db.User;

function getUserParams(body) {
  return {
    id: body.id,
    password: body.password,
    email: body.email,
    name: body.name,
    // 필요하다면 level_id, email_verified 등 추가 
  };
}
// 이메일 인증 상태 업데이트
const findUserById = async (email) => {
  return await User.findOne({ where: { email } });
};

// 회원가입 
const create = (req, res, next) => {
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
      req.flash("error", `${error.message}로 인해 회원가입에 실패했습니다.`);
      res.locals.redirect = "/users/new";
      next();
    });
};

// 로그인 폼 보여주기
const login = (req, res) => {
  res.render("login");  // views/login.ejs
};

// 로그인 인증 처리
// Passport-local-sequelize 사용
const authenticate = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
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

// 리다이렉트 뷰
const redirectView = (req, res) => {
  res.redirect(res.locals.redirect);
};

// 이메일 인증 코드 발송
const crypto = require("crypto");

const sendResetEmail = async (req, res, next) => {
  console.log("RESET 요청 도착");
  const { email } = req.body;
  console.log("입력된 이메일:", email);


  try {
    const user = await User.findOne({ where: { email } });
    console.log("유저 검색 결과:", user ? user.email : "유저 없음");


    if (!user) {
      console.log("유저 없음 - redirect");
      req.flash("error", "존재하지 않는 이메일입니다.");
      res.locals.redirect = "/users/reset-password";
      return next();
    }

    // 인증코드 생성 (6자리 난수)
    const code = crypto.randomInt(100000, 999999).toString();
    user.authCode = code;
    await user.save();

    console.log("생성된 인증코드:", code);

    // 실제 메일 보내는 부분은 nodemailer로 추후 구현
    //console.log(`인증코드: ${code} (임시 출력)`);

     res.locals.email = email;
     req.flash("success", `${user.name}님에게 인증코드를 발송했습니다.`);
     res.locals.user = user;
     res.locals.redirect = "/users/reset-password";
     next();
  } catch (error) {
    console.error("인증코드 발송 오류:", error.message);
    req.flash("error", "인증코드 발송 중 오류 발생");
    res.locals.redirect = "/users/reset-password";
    next();
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

    // 인증 성공
    req.flash("success", "인증 성공! 비밀번호를 재설정하세요.");
    res.locals.user = user;
    res.locals.redirect = "/users/reset-form"; // resetPassword2.ejs로 이동
    next();
  } catch (err) {
    console.error(err.message);
    req.flash("error", "인증 도중 오류가 발생했습니다.");
    res.locals.redirect = "/users/reset-password";
    next();
  }
};



// 비밀번호 재설정 폼 보여주기
const showResetForm = (req, res) => {
  res.render("resetPassword2");  // views/resetPassword2.ejs
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
  res.render("new");            // views/new.ejs
};

// 인증코드 요청 폼 렌더링
const showResetRequestForm = (req, res) => {
  res.render("resetPassword");  // views/resetPassword.ejs
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