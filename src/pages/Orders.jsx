import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../context/useAuth';
import { orderAPI } from '../service/api';

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.id) {
      loadOrders();
    } else {
      setError('User information not available. Please log in again.');
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await orderAPI.getUserOrders(user.id);
      const ordersData = Array.isArray(response.data) ? response.data : [];
      
      setOrders(ordersData);
    } catch (error) {
      let errorMessage = 'Failed to load orders. ';
      
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to view these orders.';
      } else if (error.response?.status === 404) {
        errorMessage = 'No orders found for your account.';
        setOrders([]);
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error. Is the backend running?';
      } else {
        errorMessage += error.response?.data?.error || error.message || 'Unknown error';
      }

      setError(errorMessage);
      setOrders([]);
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
        <p className="mt-3 text-muted">Loading your orders...</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Orders</h1>
        <Button 
          variant="outline-primary" 
          size="sm"
          onClick={loadOrders}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </Button>
      </div>

      {error && (
        <Alert 
          variant="danger" 
          dismissible 
          onClose={() => setError('')}
          className="mb-3"
        >
          <Alert.Heading>Error</Alert.Heading>
          <p className="mb-0">{error}</p>
        </Alert>
      )}

      {orders.length === 0 ? (
        <Container className="text-center py-5">
          <i className="bi bi-box-seam" style={{ fontSize: '4rem', color: '#ccc' }}></i>
          <h2 className="mt-3">No orders yet</h2>
          <p className="text-muted">Your order history will appear here</p>
        </Container>
      ) : (
        orders.map(order => (
          <Card key={order.id} className="mb-3">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Order #{order.id}</strong>
                  <span className="text-muted ms-3">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div>
                  {order.status ? getStatusBadge(order.status) : <Badge bg="secondary">Unknown</Badge>}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {order.orderItems && order.orderItems.length > 0 ? (
                <>
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
                      {order.orderItems.map((item, index) => (
                        <tr key={item.id || index}>
                          <td>
                            <div className="d-flex align-items-center">
                              {item.product?.imageUrl && (
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product?.name || 'Product'}
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                  className="me-3"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/50';
                                  }}
                                />
                              )}
                              <span>{item.product?.name || 'Unknown Product'}</span>
                            </div>
                          </td>
                          <td>{item.quantity || 0}</td>
                          <td>${(item.price || 0).toFixed(2)}</td>
                          <td>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <hr />
                </>
              ) : (
                <Alert variant="warning" className="mb-3">
                  No items in this order
                </Alert>
              )}

              <div className="d-flex justify-content-between">
                <div>
                  <strong>Shipping Address:</strong>
                  <p className="text-muted mb-0">
                    {order.shippingAddress || 'No address provided'}
                  </p>
                </div>
                <div className="text-end">
                  <h5 className="text-primary">
                    Total: ${(order.totalAmount || 0).toFixed(2)}
                  </h5>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default Orders;