import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { id } = useParams(); // récupère l'id depuis l'URL
  const [html, setHtml] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/app/order/${id}/`)
      .then(res => setHtml(res.data)) // réponse HTML brute
      .catch(err => console.error("Erreur lors de la récupération de la commande :", err));
  }, [id]);

  return (
    <div>
 
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default OrderDetail;
