import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Product.css';

const Product = () => {
  const location = useLocation();
  const { product } = location.state;

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const userId = localStorage.getItem('userId'); // userId를 localStorage에서 가져오기
  const navigate = useNavigate(); // navigate 함수 추가
  useEffect(() => {
    // 상품 데이터와 찜 목록 가져오기
    fetchProducts();
    fetchWishlist();
  }, []);

  useEffect(() => {
    // 찜 목록을 가져온 후, 해당 상품이 찜 목록에 있는지 확인하여 상태 설정
    if (wishlist.length > 0) {
      setIsWishlisted(isProductInWishlist(product.PRODUCT_SEQ));
    }
  }, [wishlist, product.PRODUCT_SEQ]);

  const fetchProducts = async () => {
    const response = await fetch('http://localhost:3307/api/product');
    const data = await response.json();
    setProducts(data.products);
  };

  const fetchWishlist = async () => {
    const userId = localStorage.getItem('userId'); // 로컬 스토리지에서 사용자 ID 가져오기
    if (!userId) {
      console.error("로그인이 필요합니다.");
      return;
    }
  
    const response = await fetch(`http://localhost:3307/api/wishlist/${userId}`);
    const data = await response.json();
    setWishlist(data.wishlist);
  };

  const handleAddToWishlist = async (productId) => {
    const userId = localStorage.getItem('userId'); // 로컬 스토리지에서 사용자 ID 가져오기
    if (!userId) {
      console.error("로그인이 필요합니다.");
      return;
    }

    const response = await fetch('http://localhost:3307/api/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, productId })
    });
    if (response.ok) {
      setIsWishlisted(true); // UI 업데이트를 위한 즉각 반영
      alert('상품이 찜목록에 추가되었습니다.');
      fetchWishlist(); // DB의 찜 목록도 업데이트하여 UI 상태와 동기화
    }
  };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem('userId'); // 로컬 스토리지에서 사용자 ID 가져오기
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3307/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          productId: product.PRODUCT_SEQ,
          quantity
        })
      });
      if (response.ok) {
        alert('상품이 장바구니에 추가되었습니다.');
      } else {
        console.error('장바구니 추가 중 오류 발생');
      }
    } catch (error) {
      console.error('서버 요청 중 오류 발생:', error);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    const userId = localStorage.getItem('userId'); // 로컬 스토리지에서 사용자 ID 가져오기
    const response = await fetch('http://localhost:3307/api/remove', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, productId })
    });
    if (response.ok) {
      setIsWishlisted(false); // UI 업데이트를 위한 즉각 반영
      alert('찜이 취소되었습니다.');
      fetchWishlist(); // DB의 찜 목록도 업데이트하여 UI 상태와 동기화
    }
  };

  //결제
  const handleImmediatePayment = () => {
    // Calculate the total price
    const total = product.PRODUCT_PRICE * quantity;
  
    // Navigate to the payment page with order details
    navigate('/payment', {
      state: {
        userId,
        product,
        quantity,
        total,
      },
    });
  };


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
    if (isWishlisted) {
      handleRemoveFromWishlist(product.PRODUCT_SEQ);
    } else {
      handleAddToWishlist(product.PRODUCT_SEQ);
    }
  };

  const isProductInWishlist = (productId) => {
    return wishlist && wishlist.some((item) => item.PRODUCT_SEQ === productId);
  };
  
  return (
    <div className="product-container">
      <div className="product-image">
        <img 
          src={product.PRODUCT_IMAGE} 
          alt={product.PRODUCT_NAME} 
          style={{ height: '550px', width: 'auto' }}
        />
      </div>
      <div className="product-details">
        <table>
          <tr>
            <td>{product.CATEGORY_NAME} : {product.SUBCATEGORY_NAME}</td>
          </tr>
          <tr>
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
          <button className="cart-button2" onClick={handleAddToCart}></button>
          <button className="buy-button" onClick={handleImmediatePayment} >구매하기</button>
        </div>
      </div>
    </div>
  );
};

export default Product;
