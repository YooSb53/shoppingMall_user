// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../../../../shoppingmall/backend/config/db_connect'); // DB 연결 모듈

// 장바구니에 상품 추가
router.post('/cart/add', (req, res) => {
  const { userId, productId, quantity } = req.body;

  // 장바구니에 이미 해당 상품이 있는지 확인
  const checkQuery = 'SELECT * FROM cart WHERE USER_ID = ? AND PRODUCT_SEQ = ?';
  connection.query(checkQuery, [userId, productId], (error, results) => {
    if (error) return res.status(500).json({ message: '오류 발생', error });

    if (results.length > 0) {
      // 이미 상품이 존재하는 경우 수량만 업데이트
      const updateQuery = 'UPDATE cart SET QUANTITY = QUANTITY + ? WHERE USER_ID = ? AND PRODUCT_SEQ = ?';
      connection.query(updateQuery, [quantity, userId, productId], (error) => {
        if (error) return res.status(500).json({ message: '수량 업데이트 중 오류', error });
        res.status(200).json({ message: '상품 수량이 업데이트되었습니다.' });
      });
    } else {
      // 새 상품을 장바구니에 추가
      const insertQuery = 'INSERT INTO cart (USER_ID, PRODUCT_SEQ, QUANTITY) VALUES (?, ?, ?)';
      connection.query(insertQuery, [userId, productId, quantity], (error) => {
        if (error) return res.status(500).json({ message: '상품 추가 중 오류', error });
        res.status(200).json({ message: '상품이 장바구니에 추가되었습니다.' });
      });
    }
  });
});


// 장바구니에서 상품 제거
router.delete('/cart/remove', (req, res) => {
  const { userId, productId } = req.body;

  const deleteQuery = 'DELETE FROM cart WHERE USER_ID = ? AND PRODUCT_SEQ = ?';
  connection.query(deleteQuery, [userId, productId], (error) => { 
    if (error) return res.status(500).json({ message: '상품 제거 중 오류 발생', error });
    res.status(200).json({ message: '상품이 장바구니에서 제거되었습니다.' });
  });
});

// 특정 사용자의 장바구니 목록 조회
router.get('/cart/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT c.CART_SEQ, c.QUANTITY, c.CREATE_AT, p.PRODUCT_NAME, p.PRODUCT_SEQ, p.PRODUCT_PRICE, 
           TO_BASE64(p.PRODUCT_IMAGE) AS PRODUCT_IMAGE
    FROM cart c
    JOIN product p ON c.PRODUCT_SEQ = p.PRODUCT_SEQ
    WHERE c.USER_ID = ?
  `;
  connection.query(query, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: '장바구니 목록 조회 중 오류 발생', error });
    }
    res.status(200).json({ cart: results });
  });
});


// 장바구니 상품 수량 업데이트
router.put('/api/cart/update-del-state', (req, res) => {
  const { userId, cartItems } = req.body;
  const productIds = cartItems.map(item => item.productId);

  const query = 'UPDATE cart SET DEL_STATE = 0 WHERE USER_ID = ? AND PRODUCT_SEQ IN (?)';
  connection.query(query, [userId, productIds], (error, results) => {
    if (error) {
      console.error('DEL_STATE 업데이트 중 오류 발생:', error);
      return res.status(500).json({ message: 'DEL_STATE 업데이트 중 오류가 발생했습니다.' });
    }
    res.status(200).json({ message: 'DEL_STATE가 성공적으로 업데이트되었습니다.' });
  });
});


module.exports = router;