import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);
  const navigate = useNavigate();

  // Récupérer les détails du produit
  useEffect(() => {
    axios.get(`http://localhost:8000/api/app/${id}/`)
      .then(res => setProduct(res.data))
      .catch(err => {
        console.error(err);
        setProduct(null);
      });
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  const handleOrderCreation = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIds = cart.map(item => item.id);
    const quantities = cart.map(item => item.quantity);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
      navigate('/login');
      return;
    }

    const orderData = {
      product_ids: productIds,
      quantities: quantities,
      email: user.email, // ✅ le backend attend "email", pas "user_id"
    };

    axios.post('http://localhost:8000/api/app/create-order/', orderData)
      .then(response => {
        console.log("Order created:", response.data);
        localStorage.removeItem('cart');
        navigate('/order-success');
      })
      .catch(error => {
        console.error("Error creating order:", error);
      });
  };

  if (!product) return <p>Produit non trouvé ou en cours de chargement...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{product.name}</h1>
      <p><strong>Description :</strong> {product.description}</p>
      <p><strong>Prix :</strong> {product.price} €</p>

      {!showQuantity ? (
        <button
          onClick={() => setShowQuantity(true)}
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
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              style={{ width: '60px' }}
            />
          </label>
          <br /><br />
          <button
            onClick={handleAddToCart}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Ajouter au panier
          </button>
          <br />
          <button
            onClick={handleOrderCreation}
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
