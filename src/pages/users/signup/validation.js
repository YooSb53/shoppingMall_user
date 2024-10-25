// useValidation.js

const patterns = {
  username: /^.{4,}$/, // 4자 이상
  password: /^.{4,}$/, // 4자 이상
  email: /^[A-Za-z0-9_.+-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-.]+$/, // 유효한 이메일 형식
  birthdate: /^\d{8}$/, // 숫자 8자리
  phone1: /^\d{3}$/, // 전화번호 첫 부분 (3자리 숫자)
  phone2: /^\d{4}$/, // 전화번호 중간 부분 (4자리 숫자)
  phone3: /^\d{4}$/ // 전화번호 마지막 부분 (4자리 숫자)
};

// 유효성 검사 메시지
const messages = {
  username: '아이디는 4자 이상이어야 합니다.',
  password: '비밀번호는 4자 이상이어야 합니다.',
  email: '유효한 이메일 주소를 입력해주세요.',
  name: '이름을 입력해주세요.',
  birthdate: '생년월일은 숫자 8자리로 입력해야 합니다.',
  phone1: '전화번호 첫 부분은 3자리 숫자여야 합니다.',
  phone2: '전화번호 중간 부분은 4자리 숫자여야 합니다.',
  phone3: '전화번호 마지막 부분은 4자리 숫자여야 합니다.',
};

// 유효성 검사 함수
const validate = (value, type) => {
  if (type === 'name') {
    return value.trim() !== ''; // 빈칸 체크
  }
  return patterns[type].test(value);
};

// 모든 검사를 통과하는지 확인하는 함수
export const validateInputs = (username, password, email, name, birthdate, phone1, phone2, phone3) => {
  const validators = {
    username,
    password,
    email,
    name,
    birthdate,
    phone1, // 첫 번째 전화번호
    phone2, // 두 번째 전화번호
    phone3, // 세 번째 전화번호
  };

  for (const [key, value] of Object.entries(validators)) {
    if (!validate(value, key)) {
      alert(messages[key]);
      return false;
    }
  }
  
  // 모든 검사를 통과하면 true 반환
  return true; 
};
