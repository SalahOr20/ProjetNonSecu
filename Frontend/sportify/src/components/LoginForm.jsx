import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/user/login/', formData);
      const { access, refresh } = res.data;
      const email = formData.email;
      login(email, { access, refresh });
      alert('Connexion réussie');
    } catch (err) {
      alert('Identifiants invalides');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default LoginForm;
