import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const [usernameError, setUsernameError] = useState(''); // 아이디 에러 메시지 상태 추가

  const navigate = useNavigate();

  const validateInputs = () => {
    // 아이디 유효성 검사: 영어 4글자 이상
    const usernamePattern = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,}$/;
    if (!usernamePattern.test(username)) {
      alert('아이디는 영어로 4자 이상이어야 합니다.');
      return false;
    }

    // 비밀번호 유효성 검사: 영어 4자 이상  
    const passwordPattern = /^.{4,}$/;
    if (!passwordPattern.test(password)) {
      alert('비밀번호는 4자 이상이어야 합니다.');
      return false;
    }

    // 이메일 유효성 검사
    const emailPattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if (!emailPattern.test(email)) {
      alert('유효한 이메일 주소를 입력해주세요.');
      return false;
    }

    // 생년월일 유효성 검사: 숫자 8자리
    const birthdatePattern = /^\d{8}$/;
    if (!birthdatePattern.test(birthdate)) {
      alert('생년월일은 숫자 8자리로 입력해야 합니다.');
      return false;
    }

    if (name.trim() === '') {
      alert('이름을 입력해주세요.');
      return false;
    }

    // 전화번호 유효성 검사: 숫자만
    const phonePattern1 = /^\d{3}$/;
    if (!phonePattern1.test(phone1)) {
      alert('숫자만 입력해야 합니다.');
      return false;
    }

    const phonePattern2 = /^\d{4}$/;
    if (!phonePattern2.test(phone2)) {
      alert('숫자만 입력해야 합니다.');
      return false;
    }

    const phonePattern3 = /^\d{4}$/;
    if (!phonePattern3.test(phone3)) {
      alert('숫자만 입력해야 합니다.');
      return false;
    }

    return true; // 모든 검사를 통과하면 true 반환
  };

  const checkUsername = async (username) => {
    // 아이디 중복 확인 요청
    try {
      const response = await fetch(`http://localhost:3307/api/check-username/${username}`);
      const data = await response.json();

      if (data.exists) {
        setUsernameError('이미 가입된 아이디입니다.'); // 중복된 아이디 메시지 설정
      } else {
        setUsernameError(''); // 중복되지 않은 경우 에러 메시지 제거
      }
    } catch (error) {
      console.error('아이디 중복 확인 오류:', error);
    }
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (newUsername) {
      checkUsername(newUsername); // 아이디 변경 시 중복 확인
    } else {
      setUsernameError(''); // 아이디가 비어있으면 에러 메시지 제거
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!validateInputs()) {
      return; // 유효성 검사에 실패하면 제출하지 않음
    }

    // 전화번호 조합
    const phone = `${phone1}-${phone2}-${phone3}`;

    const userData = {
      username,
      password,
      email,
      name,
      birthdate,
      gender,
      phone,
    };

    try {
      const response = await fetch('http://localhost:3307/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('회원가입 성공');
        navigate('/'); // 회원가입 성공 후 홈으로 이동
      } else {
        console.log('응답 상태 코드:', response.status);
        console.log('응답 내용:', data);
        alert('회원가입 실패: ' + data.message);
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
    }
  };

  return (
    <div className="signup-form">
      <h1 className="clickable-title" onClick={() => alert('Title Clicked')}>
        Luckybiky Style Edition
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={handleUsernameChange} // 아이디 입력 시 처리
          />
          {usernameError && <span className="error-message">{usernameError}</span>} {/* 에러 메시지 표시 */}
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="생년월일 8자리"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </div>

        <div className="radio-group">
          <button
            type="button"
            className={gender === '1' ? 'active' : ''}
            onClick={() => setGender('1')}
          >
            남자
          </button>
          <button
            type="button"
            className={gender === '0' ? 'active' : ''}
            onClick={() => setGender('0')}
          >
            여자
          </button>
        </div>

        <div className="phone-input-group">
          <input
            type="text"
            maxLength="3"
            placeholder="010"
            value={phone1}
            onChange={(e) => setPhone1(e.target.value)}
            className="phone-part"
          />
          <span>-</span>
          <input
            type="text"
            maxLength="4"
            placeholder="xxxx"
            value={phone2}
            onChange={(e) => setPhone2(e.target.value)}
            className="phone-part"
          />
          <span>-</span>
          <input
            type="text"
            maxLength="4"
            placeholder="xxxx"
            value={phone3}
            onChange={(e) => setPhone3(e.target.value)}
            className="phone-part"
          />
        </div>

        <button type="submit" className="submit-button">
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Signup;
