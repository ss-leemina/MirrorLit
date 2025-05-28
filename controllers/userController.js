const db = require("../models");
const User = db.User;
//const crypto = require("crypto");

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

//회원가입
const create = async (req, res, next) => {
  const { name, id, email, password, confirmPassword, emailCode, term1, term2 } = req.body;

  // 1. 비밀번호 불일치 체크
  if (password !== confirmPassword) {
    req.flash("error", "비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    return res.render("new", { name, id, email, password, confirmPassword, messages: req.flash() });
  }

  // 2. 약관 동의 체크
  if (!term1 || !term2) {
    req.flash("error", "필수 약관에 모두 동의해야 회원가입이 가능합니다.");
    return res.render("new", { name, id, email, password, confirmPassword, messages: req.flash() });
  }

  // 3. 인증 코드 확인
  const codeRecord = await db.EmailVerification.findOne({
    where: { email, code: emailCode, verified: 'N' }
  });

  if (!codeRecord) {
    req.flash("error", "유효하지 않은 인증 코드입니다.");
    return res.render("new", { name, id, email, password, confirmPassword, messages: req.flash() });
  }

  // 4. 인증 코드 유효시간 확인 (5분 이내)
  const now = new Date();
  const sentTime = new Date(codeRecord.sent_at);
  if (now - sentTime > 5 * 60 * 1000) {
    req.flash("error", "인증 코드가 만료되었습니다.");
    return res.render("new", { name, id, email, password, confirmPassword, messages: req.flash() });
  }

  // 5. 유효성 다 통과하면 코드 인증 완료 처리
  await codeRecord.update({ verified: 'Y', verified_at: now });
  
  // 6. 회원 가입 수행
try {
  const user = await db.User.create({
    name,
    id,
    email,
    password,
    level_id: 0,
    email_verified: 'Y'
  });

  // 회원가입 성공 후 email_verifications의 user_id 업데이트
  await db.EmailVerification.update(
    { user_id: user.user_id },
    {
      where: {
        email: user.email,
        verified: 'Y',
        user_id: null
      }
    }
  );

  req.flash("success", `${user.name}님, 회원가입이 완료되었습니다.`);
  res.locals.redirect = "/users/login";
  res.locals.user = user;
  next();

} catch (error) {
  if (error.name === 'SequelizeUniqueConstraintError') {
    // 중복 확인
    const field = error.errors[0].path; 
    let message = '';

    switch (field) {
      case 'email':
        message = '이미 사용 중인 이메일입니다.';
        break;
      case 'id':
        message = '이미 사용 중인 아이디입니다.';
        break;
      case 'name':
        message = '이미 사용 중인 닉네임입니다.';
        break;
      default:
        message = '중복된 값이 있습니다.';
    }

    req.flash('error', message);
    return res.render('new', { name, id, email, password, confirmPassword, messages: req.flash() });
  }

  // 그 외 에러 처리
  console.error("회원가입 오류:", error.message);
  req.flash("error", error.message);
  res.render("new", { name, id, email, password, confirmPassword, messages: req.flash() });
}
};

// 로그인 폼
const login = (req, res) => {
  res.render("login", { messages: req.flash() });
};
;

// 로그아웃
const logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy(() => {
      res.locals.redirect = "/users/login"; 
      next();
    });
  });
};

// 리다이렉션 처리
const redirectView = (req, res) => {
  if (res.locals.redirect) {
    res.redirect(res.locals.redirect);
  } else {
    res.end(); 
  }
};


// 비밀번호 재설정 폼
const showResetForm = (req, res) => {
  res.render("resetPassword2", { messages: req.flash() });
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
  res.render("resetPassword", { messages: req.flash() });
};



module.exports = {
  create,
  login,
  logout,
  redirectView,
  showSignupForm,
  showResetRequestForm,
  showResetForm,
  resetPasswordFinal,
  
};
