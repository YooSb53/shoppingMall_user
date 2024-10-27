import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Addaddress.css';
import AddressSearch from './AddressSearch';

function AddAddress() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [request, setRequest] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const navigate = useNavigate();
  
  const handleSaveAddress = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3307/api/address/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          name,
          phone,
          postcode,
          address,
          addressDetail,
          request,
          isDefault,
        }),
      });

      console.log('Response:', response); // 응답 전체 출력

      if (!response.ok) {
        throw new Error('주소 추가 중 오류');
      }

      const data = await response.json();
      console.log('Response Data:', data); // 응답 데이터 출력
      alert(data.message);
      navigate('/users/mypage/address');

    } catch (error) {
      console.error('주소 추가 중 오류:', error);
    }
  };

  return (
    <div className="add-address-container">
      <h2>배송지 추가</h2>
      <form onSubmit={handleSaveAddress} className="address-form">
        <label className="add-address-label">이름</label>
        <input
          type="text"
          placeholder="받는 분의 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="address-name-input"
        />

        <label className="add-address-label">휴대폰번호</label>
        <input
          type="text"
          placeholder="010-"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="address-phone-input"
        />

        <label className="add-address-label">주소</label>
        <div className="address-input-group">
          <input
            type="text"
            placeholder="우편번호"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            required
            className="address-postcode-input"
          />
          <AddressSearch
            onAddressSelected={(selectedAddress, selectedPostcode) => {
              setAddress(selectedAddress);
              setPostcode(selectedPostcode);
            }}
          />
        </div>
        <input
          type="text"
          placeholder="주소"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="address-address-input"
        />
        <input
          type="text"
          placeholder="상세주소"
          value={addressDetail}
          onChange={(e) => setAddressDetail(e.target.value)}
          className="address-detail-input"
        />

        <label className="add-address-label">배송 요청사항(선택)</label>
        <select
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          className="request-select"
        >
          <option value="">배송 요청사항을 선택해주세요</option>
          <option value="문 앞에 놔주세요">문 앞에 놔주세요</option>
          <option value="직접 전달해주세요">직접 전달해주세요</option>
        </select>

        <div className="default-checkbox">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="default-checkbox-input"
          />
          <label className="default-label">기본 배송지로 설정</label>
        </div>

        <button type="submit" className="save-button">저장</button>
      </form>
    </div>
  );
}

export default AddAddress;
