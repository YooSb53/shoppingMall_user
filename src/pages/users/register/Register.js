import React, { useState } from 'react';
import './Register.css';

function SignupForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      const response = await fetch('http://localhost:3307/api/signup', {  // 3307 포트로 수정
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
  
      if (response.ok) {
        alert('회원가입 성공');
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
            onChange={(e) => setUsername(e.target.value)} 
          />
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
          인증요청
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
