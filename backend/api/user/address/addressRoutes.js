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
