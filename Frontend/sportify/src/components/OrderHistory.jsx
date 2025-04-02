import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
      console.error("Utilisateur non connecté");
      return;
    }

    axios.get(`http://localhost:8000/api/app/my-orders/?email=${user.email}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!orders.length) return <p>Aucune commande trouvée.</p>;

  return (
    <div>
      <h2>Vos commandes</h2>
      {orders.map(order => (
        <div key={order.id}>
          <h4>Commande #{order.id} - Total : {order.total_price} €</h4>
          <ul>
            {order.items.map(item => (
              <li key={item.id}>
                Produit ID : {item.product}, Quantité : {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
