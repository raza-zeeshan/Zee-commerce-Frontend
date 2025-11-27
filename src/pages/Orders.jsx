import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge } from 'react-bootstrap';
import { useAuth } from '../context/useAuth';
import { orderAPI } from '../service/api';

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders(user.id);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      PENDING: 'warning',
      CONFIRMED: 'info',
      SHIPPED: 'primary',
      DELIVERED: 'success',
      CANCELLED: 'danger'
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="text-center py-5">
        <i className="bi bi-box-seam" style={{ fontSize: '4rem', color: '#ccc' }}></i>
        <h2 className="mt-3">No orders yet</h2>
        <p className="text-muted">Your order history will appear here</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">My Orders</h1>

      {orders.map(order => (
        <Card key={order.id} className="mb-3">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Order #{order.id}</strong>
                <span className="text-muted ms-3">
                  {new Date(order.orderDate).toLocaleDateString()}
                </span>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>
          </Card.Header>
          <Card.Body>
            <Table responsive borderless className="mb-0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="me-3"
                        />
                        <span>{item.product.name}</span>
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr />
            <div className="d-flex justify-content-between">
              <div>
                <strong>Shipping Address:</strong>
                <p className="text-muted mb-0">{order.shippingAddress}</p>
              </div>
              <div className="text-end">
                <h5 className="text-primary">
                  Total: ${order.totalAmount.toFixed(2)}
                </h5>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default Orders;