import React , { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Product.css';  // 별도의 CSS 파일 사용

const Product = () => {
  const location = useLocation();
  const { product } = location.state;

  const [quantity, setQuantity] = useState(1); // 초기 개수는 1
  const [isWishlisted, setIsWishlisted] = useState(false); // 찜 여부 상태
  // 개수 감소 함수
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // 개수 증가 함수
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // 찜 버튼 클릭 함수
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted); // 상태 반전
  };

  
  return (
    
    <div className="product-container">
        
      <div className="product-image">
        <img 
          src={product.PRODUCT_IMAGE} 
          alt={product.PRODUCT_NAME} 
          style={{ height: '550px',width: 'auto' }} // 예시로 너비 400px
        />
      </div>
      <div className="product-details">
        <table>
          <tr>
            <td>{product.CATEGORY_NAME} : {product.SUBCATEGORY_NAME}</td>
          </tr>
          <tr >
            <td>상품명</td>
            <td className="product-name">{product.PRODUCT_NAME}</td>
          </tr>
          <tr>
            <td>상품코드</td>
            <td>{product.PRODUCT_CODE}</td>
          </tr>
          <tr>
            <td>색상</td>
            <td>{product.PRODUCT_COLOR}</td>
          </tr>
          <tr>
            <td>사이즈</td>
            <td>{product.PRODUCT_SIZE}</td>
          </tr>
          <tr>
            <td>판매가</td>
            <td>{product.PRODUCT_PRICE}원</td>
          </tr>
          <tr>
            <td>설명</td>
            <td>{product.PRODUCT_DESCRIPTION}</td>
          </tr>
          <tr>
            <td>수량 선택</td>
            <td>
              <div className="quantity-control">
                <button onClick={decreaseQuantity}>-</button>
                <span className="quantity-display">{quantity}</span>
                <button onClick={increaseQuantity}>+</button>
              </div>
            </td>
          </tr>
        </table>

       
        {/* 버튼들 */}
        <div className="product-buttons">
          <button className="wishlist-button" onClick={toggleWishlist}>
            <img
              src={isWishlisted ? '/img/wish-after.png' : '/img/wish-before.png'}
              alt="wishList"
            />
          </button>
          <button className="cart-button2"></button>
          <button className="buy-button">구매하기</button>
        </div>

      </div>
    </div>
  );
};

export default Product;
