import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Banner from './Banner';
import ProductGrid from './ProductGrid';

function Home() {
  return <p>Welcome to our store! Please choose a category.</p>;
}

function App() {
  return (
    <Router>
      <div className="App">
        {/* 상단 배너 */}
        <Banner />

        {/* 배너 아래의 동작 페이지 */}
        <div className="content">
          <h2>Better choices, better prices</h2>
          <Routes>
            <Route path="/" element={<Home />} /> {/* 기본 home 페이지 */}
            <Route path="/product-grid" element={<ProductGrid />} /> {/* ProductGrid 페이지 */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
