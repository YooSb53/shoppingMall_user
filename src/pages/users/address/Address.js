import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Address.css';

function Address() {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // 주소 조회 API 호출
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`http://localhost:3307/api/address/${userId}`);
        console.log('Response 상태:', response.status);

        if (!response.ok) {
          throw new Error('주소 조회 중 오류');
        }

        const data = await response.json();
        console.log('응답 데이터:', data);
        setAddresses(data.addresses || []);
      } catch (error) {
        console.error('주소 조회 중 오류:', error);
      }
    };

    fetchAddresses();
  }, [userId]);

  // 전화번호 마스킹 함수
  const maskPhoneNumber = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
  };

  const handleDeleteAddress = async (addressId) => {
    // 삭제 처리 로직
    try {
      const response = await fetch(`http://localhost:3307/api/address/${userId}/${addressId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('주소 삭제 중 오류');
      }

      setAddresses((prevAddresses) => prevAddresses.filter((address) => address.ADDRESS_SEQ !== addressId));
      console.log('삭제 완료:', response);
    } catch (error) {
      console.error('주소 삭제 중 오류:', error);
    }
  };

  return (
    <div className="address-container">
      <h2>배송지 관리</h2>
      
      {addresses.length === 0 ? (
        <p>등록된 배송지가 없습니다. 주소를 추가하세요.</p>
      ) : (
        addresses.map((address) => (
          <div key={address.ADDRESS_SEQ} className="address-card">
            <p>
              <strong>{address.RECIPIENT_NAME}</strong>
              {address.IS_DEFAULT === 1 && (
                <span className="address-default-badge">기본 배송지</span>
              )}
            </p>
            <p>{address.ADDRESS}</p>
            <p>{maskPhoneNumber(address.RECIPIENT_NUMBER)}</p> {/* 전화번호 마스킹 */}
            <div className="address-button-group">
              <button 
                onClick={() => navigate(`/users/mypage/address/edit`, { state: { userId, addressId: address.ADDRESS_SEQ } })}
              >
                수정
              </button>
              {address.IS_DEFAULT === 0 && (
                <button
                  className="address-delete-button"
                  onClick={() => handleDeleteAddress(address.ADDRESS_SEQ)}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {/* 주소 목록 하단에 추가하기 버튼 표시 */}
      <button 
        className="address-add-button"
        onClick={() => navigate(`/users/mypage/address/add`)}
      >
        주소 추가하기
      </button>
    </div>
  );
}

export default Address;
