import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    axios.get('http://localhost:8000/api/products/my-orders/', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
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
            {order.order_items.map(item => (
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
