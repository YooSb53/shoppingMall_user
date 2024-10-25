const express = require('express');
const connection = require('../../../../../shoppingmall/backend/config/db_connect');  // MySQL 연결 설정 모듈
const router = express.Router();  // router 사용

// 회원가입 API 라우트 (POST) 
// signupRoutes.js

router.post('/signup', (req, res) => {
  const { username, password, email, name, birthdate, gender, phone } = req.body;

  // 1. 입력한 USER_ID가 이미 존재하는지 확인
  const checkUserSql = 'SELECT USER_ID FROM user WHERE USER_ID = ?';
  connection.query(checkUserSql, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'DB 조회 중 오류 발생', error: err });
    }

    // 2. USER_ID가 이미 존재하면 오류 반환
    if (results.length > 0) {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
    }

    // 3. 사용자 정보 저장 SQL
    const sql = `
      INSERT INTO user
      (USER_ID, USER_PW, USER_EMAIL, USER_NAME, USER_BIRTH, USER_GENDER, USER_PHONE) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    connection.query(sql, [username, password, email, name, birthdate, gender, phone], (err, result) => {
      if (err) {
        return res.status(500).json({ message: '회원가입 실패', error: err });
      }
      return res.status(201).json({ message: '회원가입 성공' });
    });
  });
});

// 아이디 중복 확인 API
router.get('/check-username/:username', (req, res) => {
  const username = req.params.username;
  const sql = 'SELECT COUNT(*) AS count FROM user WHERE USER_ID = ?';

  connection.query(sql, [username], (err, result) => {
    if (err) {
      return res.status(500).json({ message: '서버 오류', error: err });
    }
    
    const count = result[0].count;
    return res.status(200).json({ exists: count > 0 });
  });
});


module.exports = router;  // router를 모듈로 내보냄

