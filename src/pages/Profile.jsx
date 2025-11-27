import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useAuth } from "../context/useAuth";

function Profile() {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    address: user?.address || "",
    phone: user?.phone || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Here you would call an API to update user profile
      // await userAPI.updateProfile(user.id, formData);
      setSuccess("Profile updated successfully!");
      setEditMode(false);

      // Update localStorage with new user data
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.message + " Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      address: user?.address || "",
      phone: user?.phone || "",
    });
    setEditMode(false);
    setError("");
    setSuccess("");
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body className="p-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">My Profile</h2>
                {!editMode && (
                  <Button
                    variant="outline-primary"
                    onClick={() => setEditMode(true)}
                  >
                    <i className="bi bi-pencil me-2"></i>Edit Profile
                  </Button>
                )}
              </div>

              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Username</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.username || ""}
                    disabled
                    readOnly
                  />
                  <Form.Text className="text-muted">
                    Username cannot be changed
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Email</strong>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    readOnly={!editMode}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Full Name</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!editMode}
                    readOnly={!editMode}
                    placeholder="Enter your full name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Phone</strong>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                    readOnly={!editMode}
                    placeholder="Enter your phone number"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Address</strong>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!editMode}
                    readOnly={!editMode}
                    placeholder="Enter your address"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <strong>Account Type</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.role || ""}
                    disabled
                    readOnly
                  />
                </Form.Group>

                {editMode && (
                  <div className="d-flex gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-grow-1"
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={handleCancel}
                      className="flex-grow-1"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </Form>

              {!editMode && (
                <div className="mt-4 pt-4 border-top">
                  <h5 className="mb-3">Account Information</h5>
                  <p className="text-muted mb-2">
                    <strong>Member since:</strong>{" "}
                    {new Date(user?.createdAt || Date.now).toLocaleDateString()}
                  </p>
                  <p className="text-muted mb-0">
                    <strong>Account Status:</strong>{" "}
                    <span className="badge bg-success">Active</span>
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
