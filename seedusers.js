const db = require("./models");
const bcrypt = require('bcrypt');

async function createUsers() {
  const saltRounds = 10;

  const salt2 = await bcrypt.genSalt(saltRounds);
  const hash2 = await bcrypt.hash('123456', salt2);

  await db.User.bulkCreate([
    {
      id: 'BB',
      rank_id: 1,
      email: 'bb@example.com',
      name: 'ob',
      registerDate: new Date(),
      email_verified: 'Y',
      myhash: hash2,
      mysalt: salt2,   // 추가
    }
  ]);

  console.log('✅ 사용자 추가 완료');
  process.exit();
}

createUsers().catch(console.error);

