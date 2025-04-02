import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);
  const navigate = useNavigate();

  // Fetch product details on component mount
  useEffect(() => {
    axios.get(`http://localhost:8000/api/app/${id}/`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // Add product to the cart in localStorage
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += quantity;  // Increment quantity if product is already in the cart
    } else {
      cart.push({ ...product, quantity });  // Add new product to the cart with the specified quantity
    }

    localStorage.setItem('cart', JSON.stringify(cart));  // Save updated cart in localStorage
    navigate('/cart');  // Navigate to cart page
  };

  // Create the order with the products in the cart
  const handleOrderCreation = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIds = cart.map(item => item.id);
    const quantities = cart.map(item => item.quantity);

    const user = JSON.parse(localStorage.getItem('user'));  // Get user data from localStorage

    if (!user) {
      navigate('/login');  // If the user is not logged in, redirect to the login page
      return;
    }

    const orderData = {
      product_ids: productIds,
      quantities,
      user_id: user.id,  // Send user ID to the backend
    };

    // Send the order data to the backend
    axios.post('http://localhost:8000/api/app/create-order/', orderData)
      .then(response => {
        console.log("Order created:", response.data);
        localStorage.removeItem('cart');  // Clear the cart after a successful order
        navigate('/order-success');  // Redirect to order success page
      })
      .catch(error => {
        console.error("Error creating order:", error);
      });
  };

  if (!product) return <p>Chargement...</p>;  // Show loading text until product is fetched

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{product.name}</h1>
      <p><strong>Description :</strong> {product.description}</p>
      <p><strong>Prix :</strong> {product.price} €</p>

      {!showQuantity ? (
        <button
          onClick={() => setShowQuantity(true)}  // Show quantity input on button click
          style={{ padding: '10px 20px', marginTop: '1rem', cursor: 'pointer' }}
        >
          Commander
        </button>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <label>
            Quantité :&nbsp;
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}  // Update quantity
              style={{ width: '60px' }}
            />
          </label>
          <br /><br />
          <button
            onClick={handleAddToCart}  // Add product to cart
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Ajouter au panier
          </button>
          <br />
          <button
            onClick={handleOrderCreation}  // Proceed to order creation
            style={{ padding: '10px 20px', marginTop: '1rem', cursor: 'pointer' }}
          >
            Valider la commande
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
