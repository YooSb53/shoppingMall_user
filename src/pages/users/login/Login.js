import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import './Login.css';

function Login() {
  const [username, setUsername] = useState(''); // 사용자 아이디 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const navigate = useNavigate(); // useNavigate 초기화

  // 폼 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지

    try {
      const response = await fetch('http://localhost:3307/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // 아이디와 비밀번호 전송
      });
      const data = await response.json();
      if (response.ok) {
        // 로그인 성공 시 사용자 정보를 로컬 스토리지에 저장
        localStorage.setItem('userId', username); // 사용자 ID 저장
        localStorage.setItem('user', JSON.stringify({ username })); // 사용자 정보 저장
        alert(data.message); // 로그인 성공 메시지
        // 로그인 성공 후 다른 페이지로 이동
        navigate('/'); // 로그인 후 이동할 페이지 예시
      } else {
        const errorData = await response.json();
        alert(errorData.message); // 로그인 실패 메시지
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-container1">
      <h1 className="clickable-title">
        Luckybiky Style Edition
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required // 필수 입력 사항
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // 필수 입력 사항
          />
        </div>

        <button type="submit" className="submit-button">
          로그인
        </button>
      </form>
    </div>
  );
}

export default Login;
