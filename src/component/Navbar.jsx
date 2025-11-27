import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

export default function NavigationBar() {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-shop me-2"></i>
          Zee-Commerce Store
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products">
              Products
            </Nav.Link>
            {isAdmin() && (
              <Nav.Link as={Link} to="/admin">
                Admin Dashboard
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link as={Link} to="/cart">
                  <i className="bi bi-cart3"></i> Cart
                  {getCartCount() > 0 && (
                    <Badge bg="danger" className="ms-1">
                      {getCartCount()}
                    </Badge>
                  )}
                </Nav.Link>
                <Nav.Link as={Link} to="/orders">
                  My Orders
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  <i className="bi bi-person-circle"></i> {user.username}
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

