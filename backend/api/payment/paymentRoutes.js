// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../../../../shoppingmall/backend/config/db_connect'); // DB 연결 모듈

// 결제 생성
router.post('/payment', (req, res) => {
  const { userId, cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: '결제할 상품이 없습니다.' });
  }

  // 결제 내역을 저장하기 위한 기본 정보
  const paymentQuery = 'INSERT INTO payment (USER_ID, TOTAL_AMOUNT, PAYMENT_DATE) VALUES (?, ?, NOW())';
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0); // 총 결제 금액 계산

  // 1. payment 테이블에 결제 정보를 추가합니다.
  connection.query(paymentQuery, [userId, totalAmount], (error, paymentResult) => {
    if (error) {
      console.error('결제 정보 저장 중 오류 발생:', error);
      return res.status(500).json({ message: '결제 처리 중 오류가 발생했습니다.' });
    }

    const paymentId = paymentResult.insertId; // 방금 삽입된 결제 ID 가져오기

    // 2. payment_item 테이블에 각 상품의 결제 내역을 추가합니다.
    const paymentItemsQuery = 'INSERT INTO payment_item (PAYMENT_SEQ, PRODUCT_SEQ, QUANTITY,PRICE) VALUES ?';
    const paymentItemsData = cartItems.map(item => [paymentId, item.productId, item.quantity, item.price]);

    connection.query(paymentItemsQuery, [paymentItemsData], (error) => {
      if (error) {
        console.error('결제 상품 저장 중 오류 발생:', error);
        return res.status(500).json({ message: '결제 항목 저장 중 오류가 발생했습니다.' });
      }

      res.status(200).json({ message: '결제 완료' });
    });
  });
});


// router.post('/payment', (req, res) => {
//   const { userId, paymentType, items } = req.body; // paymentType은 'cart' 또는 'direct'
//   const paymentDate = new Date();

//   // payment 테이블에 결제 정보 저장
//   const insertPaymentQuery = `
//     INSERT INTO payment (USER_ID, PAYMENT_DATE) VALUES (?, ?)
//   `;
//   connection.query(insertPaymentQuery, [userId, paymentDate], (error, result) => {
//     if (error) return res.status(500).json({ message: '결제 생성 중 오류 발생', error });

//     const paymentId = result.insertId; // 생성된 payment ID 가져오기

//     // PAYMENT_ITEM 테이블에 각 상품 정보 추가
//     const insertPaymentItemQuery = `
//       INSERT INTO payment_item (PAYMENT_SEQ, PRODUCT_SEQ, QUANTITY, PRICE) VALUES (?, ?, ?, ?)
//     `;

//     const paymentItems = items.map(item => [
//       paymentId,
//       item.productId,
//       item.quantity,
//       item.price
//     ]);

//     connection.query(insertPaymentItemQuery, [paymentItems], (error) => {
//       if (error) return res.status(500).json({ message: '결제 상품 추가 중 오류 발생', error });

//       if (paymentType === 'cart') {
//         // 장바구니 결제인 경우, 해당 상품들을 장바구니에서 삭제
//         const deleteCartQuery = `DELETE FROM cart WHERE USER_ID = ? AND PRODUCT_SEQ IN (?)`;
//         const productIds = items.map(item => item.productId);

//         connection.query(deleteCartQuery, [userId, productIds], (error) => {
//           if (error) return res.status(500).json({ message: '장바구니에서 상품 삭제 중 오류 발생', error });
//           res.status(200).json({ message: '장바구니 결제가 완료되었습니다.' });
//         });
//       } else {
//         res.status(200).json({ message: '즉시 결제가 완료되었습니다.' });
//       }
//     });
//   });
// });


module.exports = router;
