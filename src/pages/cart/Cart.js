import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  useEffect(() => {
    if (userId) {
      fetchCartItems();
    } else {
      alert("로그인이 필요합니다.");
    }
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`http://localhost:3307/api/cart/${userId}`);
      if (!response.ok) throw new Error("데이터 가져오기 실패");

      const data = await response.json();
      console.log("Cart Items Data:", data.cart); // 확인용 콘솔 로그
      setCartItems(data.cart || []);
    } catch (error) {
      console.error("장바구니 불러오기 중 오류 발생:", error);
      setCartItems([]);
    }
  };

  const handleBulkPayment = () => {
    // 결제 페이지로 cartItems를 함께 넘김
    navigate('/payment', { state: { cartItems } });
  };


  const handleQuantityChange = async (productId, newQuantity) => {
    console.log(`Received productId: ${productId}, quantity: ${newQuantity}`);

    // UI에서 즉시 변경된 값을 반영하기 위해 상태 업데이트
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.PRODUCT_SEQ === productId ? { ...item, QUANTITY: newQuantity } : item
      )
    );

    try {
      const response = await fetch('http://localhost:3307/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, productId, quantity: newQuantity })
      });

      if (!response.ok) throw new Error("수량 업데이트 실패");
    } catch (error) {
      console.error("수량 업데이트 중 오류 발생:", error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await fetch('http://localhost:3307/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, productId })
      });

      if (response.ok) {
        setCartItems((prevItems) => prevItems.filter(item => item.PRODUCT_SEQ !== productId));
      } else {
        alert("장바구니에서 삭제 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("장바구니에서 항목 제거 중 오류 발생:", error);
    }
  };

  return (
    <div className="cart-container">
      <h2>장바구니</h2>
      {cartItems.length > 0 ? (
        <table className="cart-table">
          <thead>
            <tr>
              {/* <th>체크박스</th> */}
              <th>이미지</th>
              <th>이름</th>
              <th>수량 선택</th>
              <th>가격</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.CART_SEQ}>
                {/* <td>
                  <input type="checkbox" />
                </td> */}
                <td>
                  <img
                    src={`data:${item.PRODUCT_IMAGE_TYPE};base64,${item.PRODUCT_IMAGE}`}
                    alt={item.PRODUCT_NAME}
                    style={{ width: "100px", height: "100px" }}
                  />
                </td>
                <td>
                  <h3>{item.PRODUCT_NAME}</h3>
                </td>
                <td>
                  <div className="quantity-control">
                    <button
                      onClick={() => {
                        const newQuantity = Math.max(1, item.QUANTITY - 1);
                        handleQuantityChange(item.PRODUCT_SEQ, newQuantity);
                      }}
                    >
                      -
                    </button>
                    <span>{item.QUANTITY}</span>
                    <button
                      onClick={() => {
                        const newQuantity = item.QUANTITY + 1;
                        handleQuantityChange(item.PRODUCT_SEQ, newQuantity);
                      }}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{item.PRODUCT_PRICE * item.QUANTITY}원</td>
                <td>
                  <button onClick={() => handleRemoveFromCart(item.PRODUCT_SEQ)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>장바구니에 상품이 없습니다.</p>
      )}
      <div className="payment2">
     
        <button onClick={handleBulkPayment}>장바구니 상품 결제하기</button>
      </div>
    </div>
  );
};

export default Cart;
