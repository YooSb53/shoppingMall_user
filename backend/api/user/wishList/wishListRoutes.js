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
router.get('/wishList/:userId', (req, res) => {
  const { userId } = req.params;
  connection.query(
      'SELECT * FROM wishList WHERE USER_ID = ?',
      [userId],
      (error, results) => {
          if (error) {
              return res.status(500).json({ message: '찜 목록 조회 중 오류 발생', error });
          }
          res.status(200).json({ wishlist: results });
      }
  );
});


module.exports = router;
