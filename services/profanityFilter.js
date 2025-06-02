const bannedWords = require('./bannedWords.json');


// 단어를 정규식 패턴으로 변환
function toFlexibleRegex(word) {
  // 각 글자 사이에 \s* 또는 \* 를 허용
  const chars = word.split('');
  const pattern = chars.map(char => `[${char}]\\s*\\**`).join('');
  return new RegExp(pattern, 'gi');
}

//비속어 마스킹 함수
function maskBannedWords(text) {
  let result = text;

  bannedWords.forEach(word => {
    const regex = toFlexibleRegex(word);
    result = result.replace(regex, '***');
  });

  return result;
}

module.exports = {
  maskBannedWords
};

