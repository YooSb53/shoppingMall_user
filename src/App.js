import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Banner from './components/layout/Banner';
import Signup from './pages/users/signup/Signup';
import Login from './pages/users/login/Login';
import Mypage from './pages//users/mypage/Mypage'; // 
import Mywish from './pages//users/mywish/Mywish'; // 
import Myorder from './pages//users/myorder/Myorder'; // 
import Mybag from './pages//users/mybag/Mybag'; // 
import ProductGrid from './pages/users/ProductGrid';
import Support from './pages/support/Support'; // 상품 상세 페이지 컴포넌트
import Product from './pages/product/Product'; // 상품 상세 페이지 컴포넌트
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Banner /> {/* 상단 배너 */}
        <div className="content">
          <h2></h2>
          <Routes>
            {/* 메인 페이지 (ProductGrid) */}
            <Route path="/" element={<ProductGrid />} /> 

            {/* 상품 상세 페이지 */}
            <Route path="/mybag" element={<Mybag />} /> 
            <Route path="/product" element={<Product />} /> 
            <Route path="/support" element={<Support />} /> 
            {/* 회원가입 및 로그인 페이지 */}
            <Route path="/users/signup" element={<Signup />} />
            <Route path="/users/login" element={<Login />} />

            {/* 내 정보 페이지 */}
            <Route path="/users/mypage" element={<Mypage />} />
            {/* 내 장바구니 페이지 */}
            <Route path="/users/myorder" element={<Myorder />} />
            {/* 내 장바구니 페이지 */}
            <Route path="/users/mywish" element={<Mywish />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
