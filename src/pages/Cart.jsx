import React from 'react';
import { Container, Table, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Container className="text-center py-5">
        <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
        <h2 className="mt-3">Your cart is empty</h2>
        <p className="text-muted">Add some products to get started!</p>
        <Button as={Link} to="/products" variant="primary">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Shopping Cart</h1>

      <div className="row">
        <div className="col-lg-8">
          <Card>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.productId}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.imageUrl} 
                            alt={item.productName}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            className="me-3"
                          />
                          <div>
                            <Link 
                              to={`/products/${item.productId}`}
                              className="text-decoration-none text-dark"
                            >
                              <strong>{item.productName}</strong>
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">${item.price.toFixed(2)}</td>
                      <td className="align-middle">
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                          style={{ width: '80px' }}
                        />
                      </td>
                      <td className="align-middle">
                        <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                      </td>
                      <td className="align-middle">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="text-end">
                <Button 
                  variant="outline-danger"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-lg-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>${getCartTotal().toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <h5>Total:</h5>
                <h5 className="text-primary">${getCartTotal().toFixed(2)}</h5>
              </div>
              
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Button 
                  as={Link}
                  to="/products"
                  variant="outline-secondary"
                >
                  Continue Shopping
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default Cart;