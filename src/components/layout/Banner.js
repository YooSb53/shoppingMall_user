import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate(); // 라우팅을 위한 훅

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  const handleTitleClick = () => {
    navigate('/'); // 타이틀 클릭 시 홈으로 이동
  };

   // 모든 카테고리 버튼 클릭 시 ProductGrid로 이동
  const handleCategoryClick = () => {
    //navigate('/product-grid'); // ProductGrid 페이지로 이동
    navigate('/register'); // 임시 
  };

  return (
    <div className="banner">
      <div className="banner-content">
        <div className="top-row">
          {/* 타이틀을 클릭하면 홈 페이지로 이동 */}
          <h1 className="clickable-title" onClick={handleTitleClick}>
            Luckybiky Style Edition
          </h1>
          <input type="text" className="search-bar" placeholder="찾고 싶은 상품을 검색해주세요" />
          <button className="cart-button">아무것도</button>
          <button className="cart-button">장바구니</button>
          <div className="login-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button className="login-button">로그인 / 회원가입</button>
            {isDropdownVisible && (
              <div className="dropdown-menu">
                <ul>
                  <li>로그인</li>
                    
                  <li>
                    <Link to="/users/Register">회원가입</Link>
                  </li>
                  <li>내 주문</li>
                  <li>메시지 센터</li>
                  <li>결제</li>
                  <li>위시리스트</li>
                  <li>내 쿠폰</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="bottom-row">
          <button className="category-button" onClick={handleCategoryClick}>모든 카테고리</button>
          <button className="category-button">천원마트</button>
          <button className="category-button">Choice</button>
          <button className="category-button">5일 배송</button>
          <button className="category-button">공동대첩</button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
