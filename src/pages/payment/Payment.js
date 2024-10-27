import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, product, quantity, total } = location.state || {};
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`http://localhost:3307/api/address/${userId}`);
        const data = await response.json();
        // 기본 배송지 (IS_DEFAULT === 1)만 필터링하여 설정
        setAddresses(data.addresses.filter(address => address.IS_DEFAULT === 1));
      } catch (error) {
        console.error('주소 조회 중 오류:', error);
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
  };

  const handleConfirmPayment = async () => {
    if (!selectedAddress) {
      alert('배송지를 선택해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3307/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          addressId: selectedAddress,
          cartItems: [
            {
              productId: product.PRODUCT_SEQ,
              quantity,
              price: product.PRODUCT_PRICE,
            },
          ],
          total,
        }),
      });

      if (response.ok) {
        alert('결제가 완료되었습니다!');
        navigate('/'); // 결제 성공 후 메인 페이지나 확인 페이지로 이동
      } else {
        console.error('결제 오류');
      }
    } catch (error) {
      console.error('결제 중 오류:', error);
    }
  };

  return (
    <div className="payment-container">
      <h2 className="payment-title">주문 요약</h2>
      <div className="payment-summary">
        <p>상품명: <span>{product.PRODUCT_NAME}</span></p>
        <p>단가: <span>{product.PRODUCT_PRICE}원</span></p>
        <p>수량: <span>{quantity}</span></p>
        <p>총 합계: <span>{total}원</span></p>
      </div>

      <h3 className="payment-address-title">배송지를 선택하세요</h3>
      {addresses.length === 0 ? (
        <p>등록된 기본 배송지가 없습니다. 배송지를 추가해주세요.</p>
      ) : (
        <ul className="payment-address-list">
          {addresses.map((address) => (
            <li key={address.ADDRESS_SEQ} className="payment-address-item">
              <input
                type="radio"
                name="address"
                value={address.ADDRESS_SEQ}
                onChange={() => handleAddressSelect(address.ADDRESS_SEQ)}
              />
              <label>
                {address.RECIPIENT_NAME}, {address.ADDRESS}, {address.ADDRESS_DETAIL}
              </label>
            </li>
          ))}
        </ul>
      )}

      <button className="payment-confirm-button" onClick={handleConfirmPayment}>
        결제 확인
      </button>
    </div>
  );
};

export default Payment;
