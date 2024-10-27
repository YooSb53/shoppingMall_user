import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Address.css';

function Address() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    // 주소 조회 API 호출
    fetch(`/api/address/${localStorage.getItem('userId')}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('주소 조회 중 오류');
        }
        return response.json();
      })
      .then((data) => {
        setAddresses(data.addresses);
      })
      .catch((error) => {
        console.error('주소 조회 중 오류:', error);
      });
  }, []);

  const handleDeleteAddress = (addressId) => {
    fetch(`/api/address/${addressId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('주소 삭제 중 오류');
        }
        setAddresses((prev) => prev.filter((addr) => addr.ADDRESS_SEQ !== addressId));
      })
      .catch((error) => {
        console.error('주소 삭제 중 오류:', error);
      });
  };

  return (
    <div className="mypage-container">
      <h2>배송지 관리</h2>
      
      {addresses.length === 0 ? (
        <p>등록된 배송지가 없습니다. 주소를 추가하세요.</p>
      ) : (
        addresses.map((address) => (
          <div key={address.ADDRESS_SEQ} className="address-card">
            <p>
              <strong>{address.NAME}</strong> {address.IS_DEFAULT && <span className="default-badge">기본 배송지</span>}
            </p>
            <p>{address.ADDRESS}</p>
            <p>{address.PHONE}</p>
            <button onClick={() => navigate(`/users/mypage/address/edit/${address.ADDRESS_SEQ}`)}>수정</button>
            <button onClick={() => handleDeleteAddress(address.ADDRESS_SEQ)}>삭제</button>
          </div>
        ))
      )}

      <button className="add-address-button" onClick={() => navigate('/users/mypage/address/add')}>
        배송지 추가하기
      </button>
    </div>
  );
}

export default Address;
