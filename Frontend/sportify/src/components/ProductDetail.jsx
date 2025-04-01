import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}/`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ product_id: product.id, quantity });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Ajouté au panier !');
    navigate('/products');
  };

  if (!product) return <div>Chargement...</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Prix : {product.price} €</p>
      <input type="number" value={quantity} min="1" onChange={(e) => setQuantity(parseInt(e.target.value))} />
      <button onClick={addToCart}>Ajouter au panier</button>
    </div>
  );
};

export default ProductDetail;
