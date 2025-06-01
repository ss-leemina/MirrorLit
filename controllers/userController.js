const db = require("../models");
const User = db.User;
//const crypto = require("crypto");

// 이메일로 유저 찾기
const findUserById = async (email) => {
  return await User.findOne({ where: { email } });
};

//회원가입
const create = async (req, res, next) => {
  const { name, id, email, password, confirmPassword, emailCode, term1, term2 } = req.body;

  if (password !== confirmPassword) {
    req.flash("error", "비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    return res.render("new", { name, id, email, password, confirmPassword, messages: req.flash() });
  }

  if (!term1 || !term2) {
    req.flash("error", "필수 약관에 모두 동의해야 회원가입이 가능합니다.");
    return res.render("new", { name, id, email, password, confirmPassword, messages: req.flash() });
  }

  const codeRecord = await db.EmailVerification.findOne({
    where: { email, code: emailCode, verified: 'N' }
  });

  if (!codeRecord) {
    req.flash("error", "유효하지 않은 인증 코드입니다.");
    return res.render("new", { name, id, email, password, confirmPassword, messages: req.flash() });
  }

  const now = new Date();
  const sentTime = new Date(codeRecord.sent_at);
  if (now - sentTime > 5 * 60 * 1000) {
    req.flash("error", "인증 코드가 만료되었습니다.");
    return res.render("new", { name, id, email, password, confirmPassword, messages: req.flash() });
  }

  await codeRecord.update({ verified: 'Y', verified_at: now });

  // 회원가입 수행 - register는 콜백 방식
  db.User.register(
    new db.User({
      name,
      id,
      email,
      rank_id: 1,
      email_verified: 'Y'
    }),
    password,
    async (err, user) => {
      if (err) {
        console.error("회원가입 오류:", err);
        if (err.name === 'SequelizeUniqueConstraintError') {
          const field = err.errors[0].path;
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


        req.flash("error", err.message);
        return res.render("new", { name, id, email, password, confirmPassword, messages: req.flash() });
      }

      console.log(" User.register 호출됨! user_id:", user.user_id);

      // 회원가입 성공 시 이메일 인증 테이블에 user_id 업데이트
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
    }
  );
};


// 로그인 폼
const login = (req, res) => {
  res.render("login", {
    messages: req.flash()
  });
};


// 로그아웃
const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.session.destroy(() => {
      const redirectTo = req.headers.referer || "/users/login";
      res.redirect(redirectTo);
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
// 인증코드 전송 처리
const sendResetCode = async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // 이메일 유효성 검사
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      req.flash("error", "존재하지 않는 이메일입니다.");
      return res.render("resetPassword", { messages: req.flash(), email });
    }

    // 인증코드 생성 및 저장
    await db.EmailVerification.create({
      user_id: user.user_id,
      email,
      code,
      sent_at: new Date(),
      verified: 'N'
    });

    console.log(`[DEBUG] ${email}로 인증 코드 전송됨: ${code}`);
    req.flash("success", "인증 코드가 전송되었습니다.");
    return res.render("resetPassword", { messages: req.flash(), email });

  } catch (err) {
    console.error("인증코드 전송 오류:", err);
    req.flash("error", "오류로 인해 인증 코드를 보낼 수 없습니다.");
    return res.render("resetPassword", { messages: req.flash(), email });
  }
};

const showResetForm = (req, res) => {
  res.render("resetPassword2", { messages: req.flash() });
};

// 인증코드 요청 폼 렌더링
const showResetRequestForm = (req, res) => {
  res.render("resetPassword", { messages: req.flash() });
};


// 최종 비밀번호 변경 처리
const resetPasswordFinal = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash("error", "비밀번호와 확인이 일치하지 않습니다.");
    res.render("resetPassword2", { messages: req.flash(), user: { email } });
    return;
  }

  findUserById(email)
    .then(user => {
      if (!user) {
        req.flash("error", "존재하지 않는 계정입니다.");
        res.locals.redirect = "/users/login";
        return next();
      }
      user.setPassword(password, async (err, userWithPassword) => {
        if (err) {
          req.flash("error", "비밀번호 설정 중 오류가 발생했습니다.");
          res.locals.redirect = "/users/reset-form";
          return next();
        }

        await userWithPassword.save();

        req.flash("success", "비밀번호가 성공적으로 변경되었습니다.");
        return res.redirect("/users/login");
      });
    })
    .catch(error => {
      console.error(`Error resetting password: ${error.message}`);
      req.flash("error", `${error.message}로 인해 비밀번호 변경에 실패했습니다.`);
      res.locals.redirect = "/users/reset-form";
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



const verifyResetCode = async (req, res) => {
  const { email, emailCode } = req.body;

  const record = await db.EmailVerification.findOne({
    where: { email, code: emailCode, verified: 'N' }
  });

  if (!record) {
    req.flash("error", "유효하지 않은 인증 코드입니다.");
    return res.render("resetPassword", { email, messages: req.flash() });
  }

  const now = new Date();
  if (now - record.sent_at > 5 * 60 * 1000) {
    req.flash("error", "인증 코드가 만료되었습니다.");
    return res.render("resetPassword", { email, messages: req.flash() });
  }

  await record.update({ verified: 'Y', verified_at: now });

  // 다음 단계로 (비밀번호 변경 폼)
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    req.flash("error", "사용자를 찾을 수 없습니다.");
    return res.redirect("/users/reset-password");
  }

  res.render("resetPassword2", { user, messages: req.flash() });
};

//마이페이지에 등급 정보를 함께 보여주기 위한 코드
const getMyPage = async (req, res) => {
  try {
    const userId = req.user.user_id; // 로그인된 사용자 ID

    const user = await db.User.findByPk(userId, {
      include: [{ model: db.UserRank, as: 'user_rank' }]
    });

    if (!user) {
      return res.status(404).send("사용자를 찾을 수 없습니다.");
    }

    res.render("mypage", { user });
  } catch (err) {
    console.error("마이페이지 로딩 오류:", err);
    res.status(500).send("서버 에러");
  }
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
  sendResetCode,
  verifyResetCode,
  getMyPage
};

