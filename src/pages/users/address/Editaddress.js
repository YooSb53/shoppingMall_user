import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Addaddress.css';
import AddressSearch from './AddressSearch';

function EditAddress() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [request, setRequest] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('userId'); // localStorage에서 userId 가져오기
  const addressId = location.state?.addressId; // 이전 페이지에서 전달된 addressId

  useEffect(() => {
    if (!userId || !addressId) {
      console.log("필요한 정보가 제공되지 않음");
      return; // userId나 addressId가 없으면 데이터를 로드하지 않음
    }

    const fetchAddressData = async () => {
      try {
        const response = await fetch(`http://localhost:3307/api/address/${userId}/${addressId}`);
        console.log("API 호출:", `http://localhost:3307/api/address/${userId}/${addressId}`);
        console.log("Response 상태:", response.status);

        if (!response.ok) {
          throw new Error('주소 조회 중 오류');
        }

        const data = await response.json();
        console.log("받은 데이터:", data);

        // 받은 데이터를 각 필드에 설정
        setName(data.RECIPIENT_NAME || '');
        setPhone(data.RECIPIENT_NUMBER || '');
        setPostcode(data.POSTCODE || '');
        setAddress(data.ADDRESS || '');
        setAddressDetail(data.ADDRESS_DETAIL || '');
        setRequest(data.REQUEST || '');
        setIsDefault(data.IS_DEFAULT || false);
      } catch (error) {
        console.error('주소 조회 중 오류:', error);
      }
    };

    fetchAddressData();
  }, [userId, addressId]);

  return (
    <div className="add-address-container">
      <h2>주소 수정</h2>
      <form className="address-form">
        <label className="add-address-label">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="address-name-input"
        />

        <label className="add-address-label">휴대폰번호</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="address-phone-input"
        />

        <label className="add-address-label">주소</label>
        <div className="address-input-group">
          <input
            type="text"
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
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="address-address-input"
        />
        <input
          type="text"
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

export default EditAddress;
