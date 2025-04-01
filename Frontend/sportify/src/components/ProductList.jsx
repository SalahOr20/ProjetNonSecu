import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Produits</h1>
      {products.map(product => (
        <div key={product.id}>
          <h2><Link to={`/product/${product.id}`}>{product.name}</Link></h2>
          <p>{product.description}</p>
          <p>{product.price} €</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
