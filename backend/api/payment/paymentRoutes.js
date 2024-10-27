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

router.get('/payment/:userId', (req, res) => {
  const userId = req.params.userId;

  // 1. 특정 userId의 결제 내역을 payment 테이블에서 조회
  const paymentQuery = 'SELECT * FROM payment WHERE USER_ID = ?';

  connection.query(paymentQuery, [userId], (error, payments) => {
    if (error) {
      console.error('결제 내역 조회 중 오류 발생:', error);
      return res.status(500).json({ message: '결제 내역 조회 중 오류가 발생했습니다.' });
    }

    if (payments.length === 0) {
      return res.status(404).json({ message: '결제 내역이 없습니다.' });
    }

    const paymentIds = payments.map(payment => payment.PAYMENT_SEQ);

    // 2. 각 결제의 결제 항목(payment_item)을 조회하면서 product 테이블과 조인하여 상품 이름과 이미지 가져오기
    const paymentItemsQuery = `
      SELECT pi.*, p.PRODUCT_NAME, p.PRODUCT_IMAGE 
      FROM payment_item pi
      JOIN product p ON pi.PRODUCT_SEQ = p.PRODUCT_SEQ
      WHERE pi.PAYMENT_SEQ IN (?)
    `;

    connection.query(paymentItemsQuery, [paymentIds], (error, paymentItems) => {
      if (error) {
        console.error('결제 항목 조회 중 오류 발생:', error);
        return res.status(500).json({ message: '결제 항목 조회 중 오류가 발생했습니다.' });
      }

      // 결제 내역과 결제 항목을 구조화하여 응답
      const responseData = payments.map(payment => ({
        ...payment,
        items: paymentItems
          .filter(item => item.PAYMENT_SEQ === payment.PAYMENT_SEQ)
          .map(item => ({
            PRODUCT_SEQ: item.PRODUCT_SEQ,
            PRODUCT_NAME: item.PRODUCT_NAME,
            QUANTITY: item.QUANTITY,
            PRICE: item.PRICE,
            PRODUCT_IMAGE: item.PRODUCT_IMAGE ? `data:image/jpeg;base64,${item.PRODUCT_IMAGE.toString('base64')}` : null // 이미지를 base64로 변환
          }))
      }));

      res.status(200).json({ payments: responseData });
    });
  });
});



module.exports = router;
