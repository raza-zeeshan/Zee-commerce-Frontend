import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import { authAPI } from "../service/api";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login({ username, password });
      login(response.data.token, response.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <Card style={{ maxWidth: "500px", width: "100%" }}>
        <Card.Body className="p-5">
          <h2 className="text-center mb-4">Login</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </Form>

          <div className="text-center mt-4">
            <p className="mb-0">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-light rounded">
            <small className="text-muted">
              <strong>Demo Accounts:</strong>
              <br />
              Admin: admin / admin123
              <br />
              Customer: customer / customer123
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
