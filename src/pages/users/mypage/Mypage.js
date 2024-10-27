import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import './Mypage.css';

function Mypage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeItem, setActiveItem] = useState('/users/mypage/info'); // 기본값 설정

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userId') ? true : false;
    setIsLoggedIn(userLoggedIn);
  }, []);

  const handleRestrictedAccess = (path) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/users/login');
    } else {
      setActiveItem(path); // 클릭한 항목으로 activeItem 업데이트
      navigate(path);
    }
  };

  return (
    <div className="mypage-container">
      <div className="mypage-sidebar">
        <ul>
          <li
            onClick={() => handleRestrictedAccess('/users/mypage/info')}
            className={activeItem === '/users/mypage/info' ? 'mypage-active' : ''}
          >
            내 정보
          </li>
          <li
            onClick={() => handleRestrictedAccess('/users/mypage/myorder')}
            className={activeItem === '/users/mypage/myorder' ? 'mypage-active' : ''}
          >
            주문내역
          </li>
          <li
            onClick={() => handleRestrictedAccess('/users/mypage/review')}
            className={activeItem === '/users/mypage/review' ? 'mypage-active' : ''}
          >
            내 리뷰
          </li>
          <li
            onClick={() => handleRestrictedAccess('/users/mypage/mywish')}
            className={activeItem === '/users/mypage/mywish' ? 'mypage-active' : ''}
          >
            위시리스트
          </li>
          <li
            onClick={() => handleRestrictedAccess('/users/mypage/address')}
            className={activeItem === '/users/mypage/address' ? 'mypage-active' : ''}
          >
            배송지 관리
          </li>
          <li
            onClick={() => handleRestrictedAccess('/users/mypage/inquiries')}
            className={activeItem === '/users/mypage/inquiries' ? 'mypage-active' : ''}
          >
            문의사항
          </li>
          <li
            onClick={() => handleRestrictedAccess('/users/mypage/support')}
            className={activeItem === '/users/mypage/support' ? 'mypage-active' : ''}
          >
            고객센터
          </li>
        </ul>
      </div>
      <div className="mypage-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Mypage;
