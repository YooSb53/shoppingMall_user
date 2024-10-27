import React, { useState, useEffect } from 'react';
import './Myorder.css';

function Myorder() {
  const [payments, setPayments] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`http://localhost:3307/api/payment/${userId}`);
        if (!response.ok) {
          throw new Error('결제 내역 조회 중 오류');
        }

        const data = await response.json();
        const sortedPayments = (data.payments || []).sort(
          (a, b) => new Date(b.PAYMENT_DATE) - new Date(a.PAYMENT_DATE)
        );
        setPayments(sortedPayments);
      } catch (error) {
        console.error('결제 내역 조회 오류:', error);
      }
    };

    if (userId) {
      fetchPayments();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
  };

  const formatAmount = (amount) => {
    return Number(amount).toLocaleString('ko-KR') + '원';
  };

  return (
    <div className="myorder-container">
      <h2 className="myorder-title">내 주문 내역</h2>
      {payments.length === 0 ? (
        <p className="myorder-empty">주문 내역이 없습니다.</p>
      ) : (
        <ul className="myorder-list">
          {payments.map((payment) => (
            <li key={payment.PAYMENT_SEQ} className="myorder-item">
              <div className="myorder-summary">
                <span className="myorder-date">결제 날짜: {formatDate(payment.PAYMENT_DATE)}</span>
                <span className="myorder-total">총 금액: {formatAmount(payment.TOTAL_AMOUNT)}</span>
              </div>
              <ul className="myorder-products">
                {payment.items.map((item) => (
                  <li key={item.PRODUCT_SEQ} className="myorder-product">
                    <img src={item.PRODUCT_IMAGE} alt={item.PRODUCT_NAME} className="myorder-product-image" />
                    <div className="myorder-product-details">
                      <span className="myorder-product-name">상품명: {item.PRODUCT_NAME}</span>
                      <span>수량: {item.QUANTITY}</span>
                      <span>가격: {formatAmount(item.PRICE)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Myorder;
