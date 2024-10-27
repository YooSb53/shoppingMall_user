import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import './Mypage.css';

function Mypage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인 (예: 로컬 스토리지에서 로그인 상태 확인)
    const userLoggedIn = localStorage.getItem('userId') ? true : false;
    setIsLoggedIn(userLoggedIn);
  }, []);

  const handleRestrictedAccess = (path) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/users/login');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="mypage-container">
      <div className="mypage-sidebar">
        <ul>
          <li onClick={() => handleRestrictedAccess('/users/mypage/info')} className="mypage-active">내 정보</li>
          <li onClick={() => handleRestrictedAccess('/users/mypage/myorder')}>주문내역</li>
          <li onClick={() => handleRestrictedAccess('/users/mypage/review')}>내 리뷰</li>
          <li onClick={() => handleRestrictedAccess('/users/mypage/mywish')}>위시리스트</li>
          <li onClick={() => handleRestrictedAccess('/users/mypage/address')}>배송지 관리</li>
          <li onClick={() => handleRestrictedAccess('/users/mypage/inquiries')}>문의사항</li>
          <li onClick={() => handleRestrictedAccess('/users/mypage/support')}>고객센터</li>
        </ul>
      </div>
      <div className="mypage-content">
        <Outlet /> {/* 하위 라우트의 콘텐츠가 여기에 렌더링됩니다 */}
      </div>
    </div>
  );
}

export default Mypage;
