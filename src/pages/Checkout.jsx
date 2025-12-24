import React, { useState } from 'react';
import { Container, Card, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';
import { orderAPI } from '../service/api';

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo('');
    
    // Validation
    if (!shippingAddress.trim()) {
      setError('Please enter shipping address');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!user || !user.id) {
      setError('User information is missing. Please log in again.');
      return;
    }

    setLoading(true);
    
    try {
      // Format order data exactly as backend expects
      const orderData = {
        userId: user.id,
        shippingAddress: shippingAddress.trim(),
        phone: phone.trim(),
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };

      console.log('=== DEBUG INFO ===');
      console.log('User:', user);
      console.log('Cart Items:', cartItems);
      console.log('Order Data:', orderData);
      console.log('==================');

      setDebugInfo(`Sending ${cartItems.length} items to server...`);

      const response = await orderAPI.create(orderData);
      
      console.log('Response:', response);
      console.log('Response Data:', response.data);
      
      setDebugInfo('Order created successfully!');
      
      // Clear cart after successful order
      clearCart();
      
      alert('✅ Order placed successfully! Order ID: ' + response.data.id);
      
      // Navigate to orders page
      navigate('/orders');
    } catch (error) {
      console.error('=== ERROR DETAILS ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
      console.error('====================');

      // Extract detailed error message
      let errorMessage = 'Failed to place order. ';
      
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to place orders.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid order data: ' + (error.response?.data?.error || error.response?.data?.message || 'Please check your input');
      } else if (error.response?.status === 404) {
        errorMessage = 'Server endpoint not found. Please check the backend.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please contact support.';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error. Is the backend running on http://localhost:8080?';
      } else {
        errorMessage = error.response?.data?.error 
          || error.response?.data?.message 
          || error.message 
          || 'Unknown error occurred';
      }
      
      setError(errorMessage);
      setDebugInfo(`Error: ${error.response?.status} - ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="text-center py-5">
        <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
        <h2 className="mt-3">Your cart is empty</h2>
        <Button onClick={() => navigate('/products')} variant="primary" className="mt-3">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Checkout</h1>
      
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <Alert.Heading>Order Failed</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {/* Debug Info Alert */}
      {debugInfo && (
        <Alert variant="info" dismissible onClose={() => setDebugInfo('')}>
          <small>{debugInfo}</small>
        </Alert>
      )}
      
      <div className="row">
        <div className="col-lg-8">
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Shipping Information</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>User ID:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.id || 'Not available'}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    {user?.id ? '✓ User ID found' : '✗ User ID missing - Login may have failed'}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.fullName || user?.username || ''}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={user?.email || ''}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Shipping Address *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter complete shipping address"
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={loading || cartItems.length === 0}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>

        <div className="col-lg-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {cartItems.map(item => (
                  <ListGroup.Item key={item.productId} className="px-0">
                    <div className="d-flex justify-content-between">
                      <div>
                        <div className="fw-bold">{item.productName}</div>
                        <small className="text-muted">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </small>
                      </div>
                      <div className="fw-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Items ({cartItems.length}):</span>
                <strong>${getCartTotal().toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <h5>Total:</h5>
                <h5 className="text-primary">${getCartTotal().toFixed(2)}</h5>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default Checkout;