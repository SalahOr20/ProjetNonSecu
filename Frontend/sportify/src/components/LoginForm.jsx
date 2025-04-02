import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/app/login/', formData);

      // Assuming the backend response contains user data
      const { user } = res.data;  // user data with id, email, and username

      // Save user info to localStorage
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.username,
      }));

      // Perform login actions (you may call your `login` function here if needed)
      login(user.email);

      alert('Connexion réussie');
    } catch (err) {
      alert('Identifiants invalides');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        onChange={handleChange}
        required
      />
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default LoginForm;
