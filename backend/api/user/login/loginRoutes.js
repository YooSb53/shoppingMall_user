const express = require('express');
const connection = require('../../../../../shoppingmall/backend/config/db_connect'); // MySQL 연결 설정 모듈
const router = express.Router(); // router 사용

// 로그인 API 엔드포인트
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 사용자 인증: 데이터베이스에서 사용자 정보를 조회
    const sql = 'SELECT USER_PW FROM user WHERE USER_ID = ?'; // USER_ID를 통해 비밀번호 조회
    connection.query(sql, [username], (err, results) => {
        if (err) {
            console.error('데이터베이스 오류:', err);
            return res.status(500).json({ message: '서버 오류' });
        }

        // 사용자 정보가 없으면
        if (results.length === 0) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }

        const storedPassword = results[0].USER_PW; // 데이터베이스에서 가져온 비밀번호

        // 입력된 비밀번호와 데이터베이스에 저장된 비밀번호 비교
        if (password === storedPassword) {
            return res.status(200).json({ message: '로그인 성공!' });
        } else {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }
    });
});

module.exports = router; // 라우터 내보내기
