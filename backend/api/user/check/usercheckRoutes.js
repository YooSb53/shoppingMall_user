const express = require('express');
const connection = require('../../../../../shoppingmall/backend/config/db_connect'); // MySQL 연결 설정 모듈
const router = express.Router(); // router 사용

// 사용자 정보 조회 API 엔드포인트
router.get('/user/:id', (req, res) => {
    const userId = req.params.id; // URL 파라미터에서 사용자 ID 가져오기
    const sql = 'SELECT USER_ID, USER_NAME FROM user WHERE USER_ID = ?'; // 사용자 ID로 정보 조회

    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('데이터베이스 오류:', err);
            return res.status(500).json({ message: '서버 오류' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        // 사용자 정보 반환
        return res.status(200).json({
            user: {
                id: results[0].USER_ID,
                name: results[0].USER_NAME,
            }
        });
    });
});

module.exports = router; // 라우터 내보내기
