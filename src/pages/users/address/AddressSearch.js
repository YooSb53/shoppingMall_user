import React from 'react';

function AddressSearch({ onAddressSelected }) {
  const openAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
          if (data.bname !== '') extraAddress += data.bname;
          if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
          fullAddress += (extraAddress !== '' ? ' (' + extraAddress + ')' : '');
        }

        onAddressSelected(fullAddress, data.zonecode); // 주소와 우편번호를 전달
      }
    }).open();
  };

  return (
    <button type="button" className="find-postcode-button" onClick={openAddressSearch}>
      주소 찾기
    </button>
  );
}

export default AddressSearch;
