// src/pages/users/mywish/Mywish.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Mywish.css';

const Mywish = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist(); // 페이지가 로드될 때 위시리스트 항목을 가져옵니다.
  }, []);

  const fetchWishlist = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate('/users/login'); // 로그인 필요 시 로그인 페이지로 이동
      return;
    }

    try {
      const response = await fetch(`http://localhost:3307/api/wishlist/${userId}`);
      const data = await response.json();
      console.log("Fetched Wishlist Data:", data);
      if (data.wishlist) {
        setWishlist(data.wishlist);
      } else {
        console.error("Wishlist data is missing in response:", data);
      }
    } catch (error) {
      console.error("위시리스트 불러오기 중 오류 발생:", error);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch('http://localhost:3307/api/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, productId })
      });
      if (response.ok) {
        fetchWishlist(); // 제거 후 위시리스트 갱신
      }
    } catch (error) {
      console.error("위시리스트에서 항목 제거 중 오류 발생:", error);
    }
  };

  return (
    <div className="wishlist-container">
      <h2>내 위시리스트</h2>
      <table className="wishlist-table">
      <tbody>
          {wishlist.reduce((rows, item, index) => {
            if (index % 4 === 0) rows.push([]); // 한 줄에 4개의 아이템씩
            rows[rows.length - 1].push(item);
            return rows;
          }, []).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((product) => (
                <td key={product.PRODUCT_SEQ} className="wishlist-item">
                  <img
                    src={`data:image/png;base64,${product.PRODUCT_IMAGE}`}
                    alt={product.PRODUCT_NAME}
                    style={{ width: "100px", height: "100px" }}
                  />
                  <h3>{product.PRODUCT_NAME}</h3>
                  <p>{product.PRODUCT_PRICE}원</p>
                  <img
                    src='/img/wish-after.png'
                    alt="Remove from Wishlist"
                    style={{ width: "24px", cursor: "pointer" }}
                    onClick={() => handleRemoveFromWishlist(product.PRODUCT_SEQ)}
                  />
                </td>
              ))}
              {/* 빈 셀 채우기 (한 줄에 4개가 되지 않을 경우) */}
              {row.length < 4 && Array.from({ length: 4 - row.length }).map((_, i) => (
                <td key={`empty-${i}`} className="empty-cell" />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Mywish;
