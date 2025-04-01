import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div>
        <nav style={{ padding: '1rem', background: '#f5f5f5' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Accueil</Link>
          <Link to="/products" style={{ marginRight: '15px' }}>Produits</Link>

          {user ? (
            <>
              <Link to="/cart" style={{ marginRight: '15px' }}>Panier</Link>
              <Link to="/orders" style={{ marginRight: '15px' }}>Mes commandes</Link>
              <span style={{ marginRight: '15px' }}>👤 {user}</span>
              <button onClick={logout}>Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/register" style={{ marginRight: '15px' }}>Inscription</Link>
              <Link to="/login">Connexion</Link>
            </>
          )}
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
