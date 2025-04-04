import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory';
import OrderDetail from './components/OrderDetail'; 
import Footer from './components/Footer';

import { AuthContext } from './context/AuthContext';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container nav-container">
            <Link to="/" className="nav-logo">
              Sportify
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Accueil</Link>
              <Link to="/products" className="nav-link">Produits</Link>

              {user ? (
                <>
                  <Link to="/cart" className="nav-link">Panier</Link>
                  <Link to="/orders" className="nav-link">Mes commandes</Link>
                  <span className="user-info">👤 {user}</span>
                  <button 
                    onClick={logout} 
                    className="btn btn-secondary"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-secondary">Inscription</Link>
                  <Link to="/login" className="btn btn-primary">Connexion</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/order/:id" element={<OrderDetail />} /> 
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
