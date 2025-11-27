import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { productAPI } from "../service/api";
import { useCart } from "../context/useCart";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await productAPI.getById(id);
        setProduct(response.data);
      } catch (error) {
        console.error("Error loading product:", error);
        alert("Product not found");
        navigate("/products");
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert("Product added to cart!");
    navigate("/cart");
  };

  if (!product) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left"></i> Back
      </Button>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src={product.imageUrl}
              style={{ height: "400px", objectFit: "cover" }}
            />
          </Card>
        </Col>

        <Col md={6}>
          <h1>{product.name}</h1>
          <div className="mb-3">
            <span className="badge bg-secondary">{product.categoryName}</span>
          </div>

          <h2 className="text-primary mb-4">${product.price}</h2>

          <Card className="mb-4">
            <Card.Body>
              <h5>Product Description</h5>
              <p>{product.description}</p>
            </Card.Body>
          </Card>

          <div className="mb-3">
            <strong>Availability: </strong>
            {product.stock > 0 ? (
              <span className="text-success">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-danger">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <>
              <Form.Group className="mb-4">
                <Form.Label>
                  <strong>Quantity:</strong>
                </Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  style={{ width: "100px" }}
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" onClick={handleAddToCart}>
                  <i className="bi bi-cart-plus me-2"></i>
                  Add to Cart
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    handleAddToCart();
                    navigate("/checkout");
                  }}
                >
                  Buy Now
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetail;
