import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { productAPI, categoryAPI } from "../service/api";
import { useCart } from "../context/useCart";
// import { useCart } from "../context/CartContext";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll(),
        ]);
        setFeaturedProducts(productsRes.data.slice(0, 8));
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert("Product added to cart!");
  };

  return (
    <Container>
      {/* Hero Carousel */}
      <Carousel className="mb-5">
        <Carousel.Item>
          <div
            style={{ height: "400px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius:"8px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="text-white text-center">
              <h1>Welcome to Our E-Commerce Store</h1>
              <p className="lead">Find the best products at amazing prices</p>
              <Button as={Link} to="/products" variant="light" size="lg">
                Shop Now
              </Button>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div
            style={{ height: "400px", background: "linear-gradient(135deg, #02f4e0ff 0%, #07a492ff 100%)", borderRadius:"8px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="text-white text-center">
              <h1>Special Offers</h1>
              <p className="lead">Up to 50% off on selected items</p>
              <Button as={Link} to="/products" variant="light" size="lg">
                View Deals
              </Button>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>

      {/* Categories */}
      <section className="mb-5">
        <h2 className="mb-4">Shop by Category</h2>
        <Row>
          {categories.map((category) => (
            <Col key={category.id} md={4} className="mb-3">
              <Card className="h-100 text-center">
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                  <Card.Text>{category.description}</Card.Text>
                  <Button
                    as={Link}
                    to={`/products?category=${category.id}`}
                    variant="outline-primary"
                  >
                    Browse
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="mb-4">Featured Products</h2>
        <Row>
          {featuredProducts.map((product) => (
            <Col key={product.id} md={3} sm={6} className="mb-4">
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={product.imageUrl}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate">
                    {product.name}
                  </Card.Title>
                  <Card.Text className="text-muted small flex-grow-1">
                    {product.description?.substring(0, 60)}...
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="text-primary mb-0">${product.price}</h5>
                    <div>
                      <Button
                        as={Link}
                        to={`/products/${product.id}`}
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                      >
                        View
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        <i className="bi bi-cart-plus"></i>
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
}

export default Home;
