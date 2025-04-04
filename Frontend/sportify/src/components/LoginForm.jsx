import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Réinitialiser l'erreur lors de la modification
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/api/app/login/', formData);
      const { user } = res.data;

      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.username,
      }));

      login(user.email);
      navigate('/'); // Redirection vers la page d'accueil
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Une erreur est survenue lors de la connexion. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h2 className="form-title">Connexion</h2>
        
        {error && (
          <div className="message message-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              className="form-input"
              placeholder="Votre adresse email"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Votre mot de passe"
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
