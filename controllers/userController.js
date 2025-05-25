const { User, findUserById, updateEmailVerifiedStatus } = require("../models/userModel");


function getUserParams(body) {
  return {
    id: body.id,
    password: body.password,
    email: body.email,
    name: body.name,
    // 필요하다면 level_id, email_verified 등 추가 
  };
}

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
const sendResetEmail = (req, res, next) => {
  const { id } = req.body;
  findUserById(id)
    .then(user => {
      if (!user) {
        req.flash("error", "존재하지 않는 아이디입니다.");
        res.locals.redirect = "/users/reset";
      } else {
        // TODO: 실제 메일 발송 로직 삽입
        req.flash("success", `${user.name}님에게 인증코드를 보냈습니다.`);
        res.locals.redirect = "/users/reset-form";
        res.locals.user = user;
      }
      next();
    })
    .catch(error => {
      console.error(`Error finding user: ${error.message}`);
      req.flash("error", `${error.message}로 인해 인증코드 전송에 실패했습니다.`);
      res.locals.redirect = "/users/reset";
      next();
    });
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
exports.showSignupForm = (req, res) => {
  res.render("new");            // views/new.ejs
};

// 인증코드 요청 폼 렌더링
exports.showResetRequestForm = (req, res) => {
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
  verifyEmail
};
