import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/app/register/', formData);
      alert('Inscription réussie');
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h2 className="form-title">Inscription</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              placeholder="Choisissez un nom d'utilisateur"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Votre adresse email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Choisissez un mot de passe"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            S'inscrire
          </button>
        </form>

        <div className="auth-links">
          <p>
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
