import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/app/', {
      headers: { 'Accept': 'text/html' }
    })
      .then(res => setHtml(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default ProductList;
