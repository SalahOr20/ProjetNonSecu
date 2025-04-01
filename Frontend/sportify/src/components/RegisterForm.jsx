import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/user/register/', formData);
      alert('Inscription réussie');
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Erreur lors de l’inscription');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inscription</h2>
      <input type="text" name="username" placeholder="Nom d'utilisateur" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default RegisterForm;
