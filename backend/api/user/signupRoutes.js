const express = require('express');
const bcrypt = require('bcrypt'); // 비밀번호 암호화를 위한 bcrypt
const jwt = require('jsonwebtoken'); // JWT를 사용하여 토큰 발행
const connection = require('../../../../shoppingmall/backend/server/server.js');  // MySQL 연결 설정 모듈
const router = express.Router();  // router 사용

// 회원가입 API 라우트 (POST)
router.post('/signup', async (req, res) => {
  console.log('라우트');
  const { username, password, email, name, birthdate, gender, phone } = req.body;
  console.log('라우트2222');
  try {
    console.log('try1');
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('암호화 완료');

    // 사용자 정보 저장 SQL
    const sql = `
      INSERT INTO user
      (USER_ID, USER_PW, USER_EMAIL, USER_NAME, USER_BIRTH, USER_GENDER, USER_PHONE) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    console.log('쿼리문 입력완료');

    // MySQL 쿼리 실행
    connection.query(sql, [username, hashedPassword, email, name, birthdate, gender, phone], (err, result) => {
      console.log('쿼리 실행 중 오류 발생1');
      if (err) {
        console.log('쿼리 실행 중 오류 발생2');
        console.error('쿼리 실행 중 오류 발생:', err);  // 에러 로그 출력
        return res.status(500).json({ message: '회원가입 실패', error: err });
      }
      console.log('쿼리문 실행');
      // 성공적으로 회원가입되면 JWT 토큰 발급
      const token = jwt.sign({ username }, 'your_jwt_secret_key', { expiresIn: '1h' });
      console.log('쿼리 실행 중 오류 발생1');
      return res.status(201).json({ message: '회원가입 성공', token });
      
    });
    
  } catch (error) {
    console.log('쿼리 실행 중 오류 발생3');
    return res.status(500).json({ message: '회원가입 처리 중 오류 발생', error });
  }
});

// 특정 사용자 조회 API (GET)
router.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT USER_ID, USER_EMAIL, USER_NAME, USER_BIRTH, USER_GENDER, USER_PHONE FROM user WHERE USER_ID = ?';
  
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('사용자 조회 중 오류 발생:', err);
      return res.status(500).json({ message: '사용자 조회 실패', error: err });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    
    console.log(`사용자 ${userId} 조회 성공`);
    return res.status(200).json({ user: result[0] });
  });
});

module.exports = router;  // router를 모듈로 내보냄