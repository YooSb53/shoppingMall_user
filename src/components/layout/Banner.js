import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 확인
    const userId = localStorage.getItem('userId'); // 사용자 ID 가져오기
    const user = localStorage.getItem('user'); // 사용자 정보 가져오기

    // 콘솔에 출력하여 확인
    console.log('User ID:', userId);
    console.log('User Info:', user);

    if (userId) {
      // API 호출하여 사용자 정보 가져오기
      const checkLoginStatus = async () => {
        try {
          const response = await fetch(`http://localhost:3307/api/user/${userId}`);
          const data = await response.json();

          console.log('API 응답:', data);

          if (response.ok) {
            setIsLoggedIn(true);
            setUsername(data.user.name); // 사용자 이름 설정이다
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error('로그인 상태 확인 오류:', error);
        }
      };

      checkLoginStatus();
    }
  }, []);

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  const handleTitleClick = () => {
    navigate('/'); // 타이틀 클릭 시 홈으로 이동
  };

  const handleCartClick = () => {
    navigate('/cart'); // 카테고리 클릭 시 페이지 이동
  };

  const handleCategoryClick = () => {
    navigate('/register'); // 카테고리 클릭 시 페이지 이동
  };

  const handleLogout = () => {
    localStorage.removeItem('userId'); // 로컬 스토리지에서 사용자 ID 삭제
    localStorage.removeItem('user'); // 로컬 스토리지에서 사용자 정보 삭제
    setIsLoggedIn(false); // 로그인 상태를 false로 변경
    setUsername(''); // 사용자 이름 초기화
  };

  const handleRestrictedAccess = (path) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/users/Login');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="banner">
      <div className="banner-content">
        <div className="top-row">
          <h1 className="clickable-title" onClick={handleTitleClick}>
            Luckybiky Style Edition
          </h1>
          <input type="text" className="search-bar" placeholder="찾고 싶은 상품을 검색해주세요" />
          <button className="cart-button" onClick={handleCartClick}>
            장바구니
          </button>
          <div className="login-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {isLoggedIn ? ( // 로그인 상태에 따라 다르게 표시
              <>
                <span>Hi, {username}</span>
              </>
            ) : (
              <button className="login-button">로그인 / 회원가입</button>
            )}
            {isDropdownVisible && (
              <div className="dropdown-menu">
                <ul>
                  {isLoggedIn ? (
                    <li onClick={handleLogout}>로그아웃</li>
                  ) : (
                    <>
                      <li>
                        <Link to="/users/Login">로그인</Link>
                      </li>
                      <li>
                        <Link to="/users/Signup">회원가입</Link>
                      </li>
                    </>
                  )}
                  <li onClick={() => handleRestrictedAccess('/users/mypage')}>내 정보</li>
                  <li onClick={() => handleRestrictedAccess('/users/mypage/myorder')}>주문내역</li>
                  <li onClick={() => handleRestrictedAccess('/users/mypage/mywish')}>위시리스트</li>
                  <li onClick={() => handleRestrictedAccess('/users/mypage/support')}>고객센터</li>
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
