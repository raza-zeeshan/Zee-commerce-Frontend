import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { productAPI, categoryAPI } from "../service/api";
import { useCart } from "../context/useCart";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  // Load categories - runs once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Load products based on category parameter
  useEffect(() => {
    const fetchProducts = async () => {
      const categoryParam = searchParams.get("category");

      try {
        if (categoryParam) {
          setSelectedCategory(categoryParam);
          const response = await productAPI.getByCategory(categoryParam);
          setProducts(response.data);
        } else {
          setSelectedCategory("");
          const response = await productAPI.getAll();
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Handler functions for user interactions
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        const response = await productAPI.search(searchTerm);
        setProducts(response.data);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    } else {
      try {
        const response = await productAPI.getAll();
        setProducts(response.data);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    try {
      if (categoryId) {
        const response = await productAPI.getByCategory(categoryId);
        setProducts(response.data);
      } else {
        const response = await productAPI.getAll();
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert("Product added to cart!");
  };

  return (
    <Container>
      <h1 className="mb-4">Products</h1>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={8}>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="primary">
                <i className="bi bi-search"></i> Search
              </Button>
            </InputGroup>
          </Form>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-5">
          <h4>No products found</h4>
        </div>
      ) : (
        <Row>
          {products.map((product) => (
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
                    {product.description?.substring(0, 80)}...
                  </Card.Text>
                  <div className="mb-2">
                    <small className="text-muted">
                      Category: {product.categoryName}
                    </small>
                  </div>
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
                        Details
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                  {product.stock > 0 && product.stock < 10 && (
                    <small className="text-warning mt-2">
                      Only {product.stock} left in stock!
                    </small>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
