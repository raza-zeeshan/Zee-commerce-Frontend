import React, { useState, useEffect } from "react";
import {
  Container,
  Tab,
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Badge,
} from "react-bootstrap";
import { productAPI, categoryAPI, orderAPI } from "../service/api";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Load data based on active tab
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (activeTab === "products") {
          const [productsRes, catRes] = await Promise.all([
            productAPI.getAll(),
            categoryAPI.getAll(),
          ]);
          if (isMounted) {
            setProducts(productsRes.data);
            setCategories(catRes.data);
          }
        } else if (activeTab === "categories") {
          const res = await categoryAPI.getAll();
          if (isMounted) setCategories(res.data);
        } else if (activeTab === "orders") {
          const res = await orderAPI.getAll();
          if (isMounted) setOrders(res.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  // Refresh data function
  const refreshData = async () => {
    try {
      if (activeTab === "products") {
        const [productsRes, catRes] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll(),
        ]);
        setProducts(productsRes.data);
        setCategories(catRes.data);
      } else if (activeTab === "categories") {
        const res = await categoryAPI.getAll();
        setCategories(res.data);
      } else if (activeTab === "orders") {
        const res = await orderAPI.getAll();
        setOrders(res.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Product Management
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      stock: parseInt(formData.get("stock")),
      imageUrl: formData.get("imageUrl"),
      categoryId: parseInt(formData.get("categoryId")),
    };

    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, productData);
        alert("Product updated successfully");
      } else {
        await productAPI.create(productData);
        alert("Product created successfully");
      }
      setShowProductModal(false);
      setEditingProduct(null);
      refreshData();
    } catch (error) {
      alert("Error saving product: " + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productAPI.delete(id);
        alert("Product deleted successfully");
        refreshData();
      } catch (error) {
        alert("Error deleting product: " + error.message);
      }
    }
  };

  // Category Management
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const categoryData = {
      name: formData.get("name"),
      description: formData.get("description"),
    };

    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, categoryData);
        alert("Category updated successfully");
      } else {
        await categoryAPI.create(categoryData);
        alert("Category created successfully");
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      refreshData();
    } catch (error) {
      alert("Error saving category: " + error.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure? This will affect related products.")) {
      try {
        await categoryAPI.delete(id);
        alert("Category deleted successfully");
        refreshData();
      } catch (error) {
        alert("Error deleting category: " + error.message);
      }
    }
  };

  // Order Management
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      alert("Order status updated successfully");
      refreshData();
    } catch (error) {
      alert("Error updating order status: " + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: "warning",
      CONFIRMED: "info",
      SHIPPED: "primary",
      DELIVERED: "success",
      CANCELLED: "danger",
    };
    return <Badge bg={colors[status]}>{status}</Badge>;
  };

  return (
    <Container>
      <h1 className="mb-4">Admin Dashboard</h1>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="products" title="Products">
          <div className="d-flex justify-content-between mb-3">
            <h3>Manage Products</h3>
            <Button
              onClick={() => {
                setEditingProduct(null);
                setShowProductModal(true);
              }}
            >
              <i className="bi bi-plus-lg"></i> Add Product
            </Button>
          </div>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.categoryName}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="primary"
                      className="me-2"
                      onClick={() => {
                        setEditingProduct(product);
                        setShowProductModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="categories" title="Categories">
          <div className="d-flex justify-content-between mb-3">
            <h3>Manage Categories</h3>
            <Button
              onClick={() => {
                setEditingCategory(null);
                setShowCategoryModal(true);
              }}
            >
              <i className="bi bi-plus-lg"></i> Add Category
            </Button>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="primary"
                      className="me-2"
                      onClick={() => {
                        setEditingCategory(category);
                        setShowCategoryModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="orders" title="Orders">
          <h3 className="mb-3">Manage Orders</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user?.fullName || order.user?.username}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={order.status}
                      onChange={(e) =>
                        handleOrderStatusUpdate(order.id, e.target.value)
                      }
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* Product Modal */}
      <Modal
        show={showProductModal}
        onHide={() => setShowProductModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Edit Product" : "Add Product"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProductSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                defaultValue={editingProduct?.name}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                defaultValue={editingProduct?.description}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="price"
                defaultValue={editingProduct?.price}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                defaultValue={editingProduct?.stock}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                name="imageUrl"
                defaultValue={editingProduct?.imageUrl}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="categoryId"
                defaultValue={editingProduct?.categoryId}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowProductModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Category Modal */}
      <Modal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? "Edit Category" : "Add Category"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCategorySubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                defaultValue={editingCategory?.name}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                defaultValue={editingCategory?.description}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCategoryModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
