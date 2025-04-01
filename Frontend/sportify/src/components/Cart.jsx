import React, { useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

  const validateOrder = async () => {
    const token = localStorage.getItem('accessToken');

    const product_ids = cart.map(item => item.product_id);
    const quantities = cart.map(item => item.quantity);

    try {
      const res = await axios.post('http://localhost:8000/api/products/create-order/', {
        product_ids,
        quantities,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      alert('Commande validée !');
      localStorage.removeItem('cart');
      setCart([]);
    } catch (err) {
      alert('Erreur lors de la commande');
      console.error(err.response?.data || err.message);
    }
  };

  if (!cart.length) return <p>Votre panier est vide.</p>;

  return (
    <div>
      <h2>Panier</h2>
      {cart.map((item, index) => (
        <p key={index}>Produit ID : {item.product_id}, Quantité : {item.quantity}</p>
      ))}
      <button onClick={validateOrder}>Valider la commande</button>
    </div>
  );
};

export default Cart;
