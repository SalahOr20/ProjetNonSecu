import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>À propos de Sportify</h3>
          <p>Votre destination pour l'équipement sportif de qualité. Nous proposons une large gamme de produits pour tous les sports.</p>
        </div>
        
        <div className="footer-section">
          <h3>Liens rapides</h3>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/products">Produits</Link></li>
            <li><Link to="/cart">Panier</Link></li>
            <li><Link to="/orders">Mes commandes</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li>📞 01 23 45 67 89</li>
            <li>📧 contact@sportify.com</li>
            <li>📍 123 Rue du Sport, Paris</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Suivez-nous</h3>
          <div className="social-links">
            <a href="#" className="social-link">Facebook</a>
            <a href="#" className="social-link">Twitter</a>
            <a href="#" className="social-link">Instagram</a>
            <a href="#" className="social-link">LinkedIn</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2024 Sportify. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;