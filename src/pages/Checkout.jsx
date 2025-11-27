import React, { useState } from 'react';
import { Container, Card, Form, Button, ListGroup } from 'react-bootstrap';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!shippingAddress.trim()) {
      alert('Please enter shipping address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: user.id,
        items: cartItems,
        shippingAddress: shippingAddress,
      };

      await orderAPI.create(orderData);
      clearCart();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="text-center py-5">
        <h2>Your cart is empty</h2>
        <Button onClick={() => navigate('/products')} variant="primary" className="mt-3">
          Go Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Checkout</h1>
      
      <div className="row">
        <div className="col-lg-8">
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Shipping Information</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.fullName || ''}
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
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Shipping Address</Form.Label>
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
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
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
                          ${item.price} x {item.quantity}
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
                <span>Subtotal:</span>
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