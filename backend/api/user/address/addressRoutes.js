// backend/api/address/addressRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../../../../../shoppingmall/backend/config/db_connect');  // MySQL 연결 설정 모듈

// 주소 추가 API
router.post('/address/add', (req, res) => {
  const { userId, name, phone, postcode, address, addressDetail, request, isDefault } = req.body;
  const query = `INSERT INTO address (USER_ID, RECIPIENT_NAME, RECIPIENT_NUMBER, POSTCODE, ADDRESS, ADDRESS_DETAIL, REQUEST, IS_DEFAULT)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [userId, name, phone, postcode, address, addressDetail, request, isDefault];

  connection.query(query, values, (err, result) => {
      if (err) {
          console.error('주소 추가 중 오류:', err);
          res.status(500).json({ message: '주소 추가 중 오류 발생', error: err });
      } else {
          res.status(200).json({ message: '주소가 성공적으로 추가되었습니다.' });
      }
  });
});

// 사용자 주소 조회 API
router.get('/address/:userId', (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM address WHERE USER_ID = ? AND DEL_STATE = 1;';
  
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('주소 조회 중 오류:', error);
      return res.status(500).json({ message: '주소 조회 중 오류가 발생했습니다.' });
    }
    res.status(200).json({ addresses: results });
  });
});

//수정
router.get('/address/edit/:userId/:addressId', (req, res) => {
  console.log("라우터 접근");
  const { userId, addressId } = req.params;
  console.log("userId:", userId, "addressId:", addressId);
  
  const query = 'SELECT * FROM address WHERE USER_ID = ? AND ADDRESS_SEQ = ? AND DEL_STATE = 1;';
  connection.query(query, [userId, addressId], (error, results) => {
    if (error) {
      console.error('주소 조회 중 오류:', error);
      return res.status(500).json({ message: '주소 조회 중 오류가 발생했습니다.' });
    }
    
    if (results.length === 0) {
      console.log("해당 주소를 찾을 수 없음");
      return res.status(404).json({ message: '해당 주소를 찾을 수 없습니다.' });
    }
    
    console.log("조회된 결과:", results[0]);
    res.status(200).json(results[0]);
  });
});


// DELETE 주소 삭제 상태로 업데이트 API
router.delete('/address/:addressId', (req, res) => {
  const addressId = req.params.addressId;

  const updateQuery = 'UPDATE address SET DEL_STATE = 0 WHERE ADDRESS_SEQ = ?';

  connection.query(updateQuery, [addressId], (error, results) => {
    if (error) {
      console.error('주소 삭제 상태 업데이트 중 오류:', error);
      return res.status(500).json({ message: '주소 삭제 상태 업데이트 중 오류가 발생했습니다.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: '해당 주소를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '주소가 성공적으로 삭제 되었습니다.' });
  });
});


router.put('/address/update/:addressId', (req, res) => {
  const addressId = req.params.addressId;
  const { RECIPIENT_NAME, RECIPIENT_NUMBER, POSTCODE, ADDRESS, ADDRESS_DETAIL, REQUEST, IS_DEFAULT } = req.body;

  const updateQuery = `
    UPDATE address 
    SET RECIPIENT_NAME = ?, RECIPIENT_NUMBER = ?, POSTCODE = ?, ADDRESS = ?, ADDRESS_DETAIL = ?, REQUEST = ?, IS_DEFAULT = ?
    WHERE ADDRESS_SEQ = ? AND DEL_STATE = 1
  `;

  connection.query(updateQuery, [RECIPIENT_NAME, RECIPIENT_NUMBER, POSTCODE, ADDRESS, ADDRESS_DETAIL, REQUEST, IS_DEFAULT, addressId], (error, results) => {
    if (error) {
      console.error('주소 업데이트 중 오류:', error);
      return res.status(500).json({ message: '주소 업데이트 중 오류가 발생했습니다.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: '해당 주소를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '주소가 성공적으로 업데이트되었습니다.' });
  });
});

// router.post('/address/add', (req, res) => {
//   const { userId, name, phone, postcode, address, addressDetail, request, isDefault } = req.body;

//   // 기본 배송지로 설정된 주소가 하나만 존재하도록 기존 기본 주소를 모두 비활성화  
//   if (isDefault) {
//     const resetDefaultQuery = 'UPDATE address SET IS_DEFAULT = FALSE WHERE USER_ID = ?';
//     connection.query(resetDefaultQuery, [userId], (error) => {
//       if (error) {
//         console.error('기본 배송지 리셋 중 오류 발생:', error);
//         return res.status(500).json({ message: '기본 배송지 리셋 중 오류 발생', error });
//       }

//       insertNewAddress();
//     });
//   } else {
//     insertNewAddress();
//   }

//   // 새로운 주소 추가 함수
//   function insertNewAddress() {
//     const query = `
//       INSERT INTO address (USER_ID, NAME, PHONE, POSTCODE, ADDRESS, ADDRESS_DETAIL, IS_DEFAULT, IS_DEFAULT)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     connection.query(
//       query,
//       [userId, name, phone, postcode, address, addressDetail, request, isDefault],
//       (error, results) => {
//         if (error) {
//           console.error('주소 추가 중 오류 발생:', error);
//           return res.status(500).json({ message: '주소 추가 중 오류 발생', error });
//         }

//         res.status(200).json({ message: '주소가 성공적으로 추가되었습니다.', addressId: results.insertId });
//       }
//     );
//   }
// });

module.exports = router;
