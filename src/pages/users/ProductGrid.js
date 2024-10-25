import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductGrid.css';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // 백엔드에서 상품 데이터를 가져오는 함수
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3307/api/product');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('상품을 가져오는 중 오류:', error);
      }
    };
    fetchProducts();
  }, []);

  // 상품을 클릭했을 때 호출되는 함수
  const handleProductClick = (product) => {
    console.log('클릭된 상품 정보:', product);
    navigate('/product', { state: { product } });
  };

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div 
          key={product.PRODUCT_SEQ} 
          className="product-card"
          onClick={() => handleProductClick(product)} // 클릭 이벤트 추가
        >
          <img src={product.PRODUCT_IMAGE} alt={product.PRODUCT_NAME} />
          <h3>{product.PRODUCT_NAME}</h3>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
