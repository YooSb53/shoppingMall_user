import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Banner from './components/layout/Banner';
import Signup from './pages/users/signup/Signup';
import Login from './pages/users/login/Login';
import Mypage from './pages/users/mypage/Mypage'; 
import Mywish from './pages/users/mywish/Mywish'; 
import Myorder from './pages/users/myorder/Myorder'; 
import Address from './pages/users/address/Address'; 
import Addaddress from './pages/users/address/Addaddress';
import Editaddress from './pages/users/address/Editaddress';
import Question from './pages/users/question/Question';
import Cart from './pages/cart/Cart'; 
import Searchresult from './pages/searchresult/Searchresult'; 
import Images from './pages/searchresult/Images'; 
import ProductGrid from './pages/users/ProductGrid';
import Support from './pages/support/Support'; 
import Product from './pages/product/Product'; 
import Payment from './pages/payment/Payment'; 


import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Banner /> {/* 상단 배너 */}
        <div className="content">
          <Routes>
            {/* 메인 페이지 */}
            <Route path="/" element={<ProductGrid />} /> 
            <Route path="/cart" element={<Cart />} /> 
            <Route path="/product" element={<Product />} /> 
            <Route path="/payment" element={<Payment />} /> {/* 결제창 */}
            <Route path="/searchresult" element={<Searchresult />} /> {/* 검색창 */}
            <Route path="/images" element={<Images />} /> {/* 검색창 */}

            {/* 회원가입 및 로그인 페이지 */}
            <Route path="/users/signup" element={<Signup />} />
            <Route path="/users/login" element={<Login />} />

            {/* 마이페이지 (내 정보, 주문 내역 등) */}
            <Route path="/users/mypage" element={<Mypage />}>
              <Route path="info" element={<Address />} /> {/* 내 정보 */}
              <Route path="myorder" element={<Myorder />} /> {/* 주문 내역 */}
              <Route path="mywish" element={<Mywish />} /> {/* 위시리스트 */}
              <Route path="address" element={<Address />} /> {/* 배송지 관리 */}
              <Route path="address/add" element={<Addaddress />} /> {/* 주소 추가 */}
              <Route path="address/edit" element={<Editaddress />} /> {/* 주소 수정 */}
              <Route path="support" element={<Support />} /> {/* 고객센터 */}
              <Route path="question" element={<Question />} /> {/* 문의사항 */}
              
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
