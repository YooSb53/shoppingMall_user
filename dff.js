import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css'; // 스타일 파일을 연결

const Login = () => {
  const [username, setUsername] = useState(''); // 이메일 대신 아이디를 위한 상태로 변경
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const nextPath = location.state?.nextPath || '/'; // 로그인 후 이동할 경로

  const handleLogin = async (e) => {
    e.preventDefault();

    // 로그인 로직
    try {
      const response = await fetch('http://localhost:3307/api/user/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }), // 이메일 대신 아이디 전송
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userId', data.userId); // 로그인한 사용자 ID 저장
        navigate(nextPath); // 로그인 후 원래 가고자 했던 경로로 이동
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
    }
  };

  return (
    <div className="login-container1">
      <h1 className="clickable-title">Luckybiky Style Edition</h1>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디" // 이메일 대신 아이디로 변경
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
