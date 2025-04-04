import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Load cart data from localStorage when the component mounts
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  // Handle quantity change for an item in the cart
  const handleQuantityChange = (productId, newQuantity) => {
    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));  // Save updated cart to localStorage
  };

  // Remove an item from the cart
  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));  // Save updated cart to localStorage
  };

  // Handle checkout (creating the order)
  const handleCheckout = () => {
    const productIds = cart.map(item => item.id);
    const quantities = cart.map(item => item.quantity);

    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      // If user is not logged in, redirect them to login
      navigate('/login');
      return;
    }

    // Prepare the order data including user email
    const orderData = {
      product_ids: productIds,
      quantities,
      email: user,  // Send user email
    };

    // Send the order data to the backend
    axios.post('http://localhost:8000/api/app/create-order/', orderData, {
      headers: {
        'Content-Type': 'application/json',  // Ensure correct content-type
      }
    })
    .then(response => {
      console.log("Order created:", response.data);
      localStorage.removeItem('cart');  // Clear the cart after successful order
      navigate('/order-success');  // Redirect to order success page
    })
    .catch(error => {
      console.error("Error creating order:", error);
      alert("There was an error processing your order.");
    });
  };

  // If the cart is empty, display a message
  if (cart.length === 0) {
    return <p>Votre panier est vide</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Votre Panier</h1>
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            <h3>{item.name}</h3>
            <p>Prix : {item.price} €</p>
            <label>
              Quantité :&nbsp;
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                style={{ width: '60px' }}
              />
            </label>
            <button onClick={() => handleRemoveFromCart(item.id)} style={{ marginLeft: '10px' }}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleCheckout}
        style={{ padding: '10px 20px', marginTop: '1rem', cursor: 'pointer' }}
      >
        Passer à la commande
      </button>
    </div>
  );
};

export default Cart;