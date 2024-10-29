import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Banner.css';
import './image_Search_modal.css';

const Banner = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [fileLink, setFileLink] = useState('');
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/Searchresult', { state: { searchQuery } });
  };

  const handleCategoryClick = () => {
    setIsModalOpen(true); // 버튼 클릭 시 모달 열기
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Uploaded file:', file);
      setIsModalOpen(false); // 파일이 선택되면 모달 닫기
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLinkChange = (e) => {
    setFileLink(e.target.value);
  };

  const handleLinkSearch = () => {
    console.log('Link:', fileLink);
    setIsModalOpen(false); // 링크 입력 후 모달 닫기
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const user = localStorage.getItem('user');

    console.log('User ID:', userId);
    console.log('User Info:', user);

    if (userId) {
      const checkLoginStatus = async () => {
        try {
          const response = await fetch(`http://localhost:3307/api/user/${userId}`);
          const data = await response.json();

          console.log('API 응답:', data);

          if (response.ok) {
            setIsLoggedIn(true);
            setUsername(data.user.name);
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
    navigate('/');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername('');
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
          <div className="search-bar-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="찾고 싶은 상품을 검색해주세요" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <button className="search-button" onClick={handleSearch}>
              <img src="/img/search.png" className="search-icon" />
            </button>
            <button className="extra-button" onClick={handleCategoryClick}>
              <img src="/img/in3.png" className="search-icon2" />
            </button>
          </div>
          <button className="cart-button" onClick={handleCartClick}>
            장바구니
          </button>
          <div className="login-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {isLoggedIn ? (
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

      {/* 파일 업로드 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>이미지 검색</h2>
            <div 
              className="upload-box" 
              onClick={() => fileInputRef.current.click()}
            >
              여기에 이미지를 드래그하거나 <strong>파일을 업로드</strong>하세요.
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
            <p>또는</p>
            <input 
              type="text" 
              className="input-link" 
              placeholder="이미지 링크 붙여넣기" 
              value={fileLink} 
              onChange={handleLinkChange} 
            />
            <button className="close-button" onClick={handleLinkSearch}>검색</button>
            <button className="close-button" onClick={handleCloseModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
