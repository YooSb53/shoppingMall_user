import React, { useState } from 'react';
import './App.css';
import Banner from './components/Banner';

function App() {
  return (
    <div className="App">
      <Banner />
      <div className="content">
        {/* 여기에 추가 콘텐츠를 넣을 수 있습니다. */}
      </div>
    </div>
  );
}

export default App;
