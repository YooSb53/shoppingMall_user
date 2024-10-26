// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../../../../../shoppingmall/backend/config/db_connect');  // MySQL 연결 설정 모듈

// 찜 추가
router.post('/add', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        connection.query(
        'INSERT INTO wishList (USER_ID, PRODUCT_SEQ) VALUES (?, ?)',
        [userId, productId]
      );
        res.status(200).json({ message: '상품을 찜 목록에 추가했습니다.' });
    } catch (error) {
        res.status(500).json({ message: '찜 추가 중 오류 발생', error });
    }
});

// 찜 삭제
router.delete('/remove', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        connection.query(
            'DELETE FROM wishList WHERE USER_ID = ? AND PRODUCT_SEQ = ?', 
            [userId, productId]
        );
        res.status(200).json({ message: '상품을 찜 목록에서 제거했습니다.' });
    } catch (error) {
        res.status(500).json({ message: '찜 삭제 중 오류 발생', error });
    }
});

// 사용자의 찜 목록 조회
router.get('/wishlist/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT w.WISHLIST_SEQ, w.USER_ID, w.PRODUCT_SEQ, w.CREATED_AT, 
           p.PRODUCT_NAME, p.PRODUCT_IMAGE, p.PRODUCT_PRICE
    FROM wishList w
    JOIN product p ON w.PRODUCT_SEQ = p.PRODUCT_SEQ
    WHERE w.USER_ID = ?
  `;
  connection.query(query, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: '찜 목록 조회 중 오류 발생', error });
    }
    
    // BLOB 이미지를 Base64로 변환
    const wishlist = results.map(item => {
      // PRODUCT_IMAGE 필드를 Base64 문자열로 변환
      if (item.PRODUCT_IMAGE) {
        item.PRODUCT_IMAGE = Buffer.from(item.PRODUCT_IMAGE).toString('base64');
      }
      return item;
    });

    res.status(200).json({ wishlist });
  });
});



module.exports = router;
