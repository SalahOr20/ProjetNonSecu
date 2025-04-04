import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Tableau d'images de sport
const sportImages = [
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80', // Basketball
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80', // Football
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80', // Running
  'https://images.unsplash.com/photo-1517344368193-41552b6ad3f5?w=800&q=80', // Tennis
  'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&q=80', // Volleyball
  'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80', // Cycling
];

// Fonction pour obtenir une image aléatoire
const getRandomImage = () => {
  return sportImages[Math.floor(Math.random() * sportImages.length)];
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/products/');
        // Prendre les 4 premiers produits comme produits vedettes et ajouter des images
        const productsWithImages = res.data.slice(0, 4).map(product => ({
          ...product,
          image: getRandomImage()
        }));
        setFeaturedProducts(productsWithImages);
      } catch (err) {
        console.error('Erreur lors du chargement des produits vedettes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Bienvenue sur Sportify</h1>
        <p>Découvrez notre sélection de produits de sport et d'équipements de qualité pour tous vos besoins.</p>
        <Link to="/products" className="btn btn-primary">Découvrir nos produits</Link>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Produits vedettes</h2>
        {loading ? (
          <div className="loading">Chargement des produits...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-card-content">
                  <h2 className="product-card-title">{product.name}</h2>
                  <p className="product-card-description">{product.description}</p>
                  <div className="product-card-footer">
                    <span className="product-card-price">{product.price} €</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="view-all-products">
          <Link to="/products" className="btn btn-primary">Voir tous les produits</Link>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Pourquoi choisir Sportify ?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Livraison rapide</h3>
            <p>Livraison gratuite pour toute commande supérieure à 50€</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Prix compétitifs</h3>
            <p>Les meilleurs prix du marché pour des produits de qualité</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Garantie satisfait</h3>
            <p>Retours gratuits sous 30 jours si vous n'êtes pas satisfait</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
