import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SearchResult.css';

const SearchResults = () => {
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || ''; // 전달된 검색어 받기
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const response = await fetch('http://localhost:3307/api/product');
      const data = await response.json();

      // 검색어 기반으로 상품 필터링
      const filteredProducts = data.products.filter(product =>
        product.PRODUCT_NAME.includes(searchQuery) || 
        product.CATEGORY_NAME.includes(searchQuery)
      );

      setProducts(filteredProducts);
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  return (
    <div className="search-results">
      <h2>검색 결과: {searchQuery}</h2>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.PRODUCT_SEQ} className="product-card">
              <img src={product.PRODUCT_IMAGE} alt={product.PRODUCT_NAME} className="product-image" />
              <p className="product-name">{product.PRODUCT_NAME}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default SearchResults;
