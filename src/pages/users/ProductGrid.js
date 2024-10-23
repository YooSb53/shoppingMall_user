import React from 'react';
import './ProductGrid.css';

const products = [
  { id: 1, name: '상품 1', price: '1,394원', discount: '79%', image: 'path-to-image1' },
  { id: 2, name: '상품 2', price: '7,620원', discount: '31%', image: 'path-to-image2' },
  { id: 3, name: '상품 3', price: '5,400원', discount: '50%', image: 'path-to-image3' },
  // 더 많은 상품 추가 가능
];

const ProductGrid = () => {
  return (
    <div className="product-grid">
      {products.map(product => (
          <div key={product.id} className="product-card">
            
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          <span className="discount">{product.discount}</span>
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          <span className="discount">{product.discount}</span>
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          <span className="discount">{product.discount}</span>
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          <span className="discount">{product.discount}</span>
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          <span className="discount">{product.discount}</span>
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          <span className="discount">{product.discount}</span>
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          <span className="discount">{product.discount}</span>
        </div>
        
      ))}
    </div>
  );
};

export default ProductGrid;
