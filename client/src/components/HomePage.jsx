import React from "react";
import { BsGeoAltFill, BsTelephoneFill, BsEnvelopeFill, BsClockFill } from 'react-icons/bs';
import { Container, Row, Col, Card, Button, Navbar, Nav, NavDropdown, Carousel } from "react-bootstrap";
import '../css/HomePage.css';

const HomePage = () => {
  const cardHoverStyle = {
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer"
  };

  const cardHoverEffect = {
    transform: "scale(1.05)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)"
  };

  // Prevent horizontal scroll globally
  document.body.style.overflowX = "hidden";

  return (
    <>
      {/* Navbar */}
      <Navbar bg="primary" variant="dark" expand="lg" fixed="top" className="shadow-sm p-2">
        <Container>
          <Navbar.Brand href="#">🩺 MediTrack Lite</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <Nav.Link href="/" className="text-white">Home</Nav.Link>
              <Nav.Link href="#about" className="text-white">About Us</Nav.Link>
              <Nav.Link href="#services" className="text-white">Services</Nav.Link>
              <Nav.Link href="#gallery" className="text-white">Gallery</Nav.Link>
              <Nav.Link href="#contact" className="text-white">Contact</Nav.Link>
              <NavDropdown title={<span className="text-white"> Login</span>} id="login-dropdown" menuVariant="dark">
                <NavDropdown.Item href="/admin/login">Admin Login</NavDropdown.Item>
                <NavDropdown.Item href="/login">Doctor/Patient Login</NavDropdown.Item>
              </NavDropdown>


            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Carousel */}
      <Carousel fade interval={3000} className="mb-5 mt-3">
        {["carousel(4).jpeg", "carousel(1).jpeg", "carousel(3).jpeg"].map((img, i) => (
          <Carousel.Item key={i}>
            <img
              className="w-100"
              src={`/images/${img}`}
              alt={`slide-${i}`}
              style={{ maxHeight: '550px', objectFit: 'cover' }}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Login Section */}
      <section className="py-5 text-center">
        <h2 className="mb-4">Logins</h2>
        <Container>
          <Row className="justify-content-center">
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Img variant="top" src="images/admin.jpg" height="170" />
                  <Card.Title className="mt-3">Admin Login</Card.Title>
                  <a href="/admin/login"><Button variant="primary" className="mt-2">Login</Button></a>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Img variant="top" src="images/login.jpeg" height="150" />
                  <Card.Title className="mt-3">Doctor/Patient Login</Card.Title>
                  <a href="/login"><Button variant="success" className="mt-2">Login</Button></a>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light text-center">
        <Container>
          <h2 className="mb-4">About Us</h2>
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="text-primary mb-3">About MediTrack Lite</h2>
              <p className="text-muted">MediTrack Lite is a modern web platform designed to connect doctors and patients...</p>
              <ul className="text-muted text-start ms-4">
                <li>Easy online appointment booking</li>
                <li>Role-based login for Admin, Doctors, and Patients</li>
                <li>Real-time schedule tracking</li>
                <li>Secure and responsive user interface</li>
              </ul>
            </Col>
            <Col md={6}>
              <img src="/images/gallery(3).jpeg" className="img-fluid rounded" alt="About" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      
      <section id="services" className="py-5 bg-light text-center">
  <h2 className="mb-4">Our Services</h2>
  <Container>
    <Row className="justify-content-center">
      {[
        { img: "images.png", title: "Cardiology", desc: "Heart care and treatment of cardiovascular diseases" },
        { img: "orthopedic.jpg", title: "Orthopedic", desc: "Bone, joint, and muscle treatment" },
        { img: "neurology.jpeg", title: "Neurologist", desc: "Brain, spine, and nervous system care" },
        { img: "pediatrics.jpeg", title: "Pediatrics", desc: "Child health and medical care" },
        { img: "ophthamalogy.jpeg", title: "Ophthalmology", desc: "Eye care and vision treatments" },
        { img: "dentistry.jpeg", title: "Dentistry", desc: "Dental checkups, surgeries, and oral hygiene" },
        { img: "ent.jpeg", title: "ENT", desc: "Sinus, hearing, and throat disorders" },
        { img: "dermatalogy.png", title: "Dermatology", desc: "Skin, hair, and nail treatments" }
      ].map((s, i) => (
        <Col md={3} key={i} className="mb-4 d-flex">
          <Card
            className="border-0 shadow-sm w-100"
            style={{ ...cardHoverStyle }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverEffect)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
          >
            <Card.Body className="d-flex flex-column align-items-center justify-content-between text-center" style={{ height: '100%' }}>
              <Card.Img
                variant="top"
                src={`/images/${s.img}`}
                height="110"
                className="rounded w-75 mb-2"
              />
              <div className="mt-auto">
                <Card.Title className="fw-bold" style={{ fontSize : '15px' }}>{s.title}</Card.Title>
                <p className="text-black" style={{ fontSize : '12px' }}>{s.desc}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
</section>



      {/* Gallery Section */}
      <section id="gallery" className="py-5 text-center mb-5">
        <h2 className="mb-4">Gallery</h2>
        <Container>
          <Row className="justify-content-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <Col md={3} className="mb-3" key={i}>
                <img
                  src={`/images/gallery(${i + 1}).jpeg`}
                  height="130"
                  className="rounded w-75"
                  alt=""
                  style={cardHoverStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverEffect)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Contact Us */}
      <h2 className="text-center mb-3">Contact Us</h2>
      <div id="contact" className="bg-dark py-4">
        <Container>
          <Row className="text-center text-white">
            <Col md={4}>
              <h5 className="fw-bold">Meditrack Lite</h5>
              <p>Providing quality healthcare services with a personal touch since 2005.</p>
            </Col>
            <Col md={4}>
              <h5 className="fw-bold">Contact Us</h5>
              <p><BsGeoAltFill className="me-2" />123 Medical Center Dr, Healthcare City</p>
              <p><BsTelephoneFill className="me-2" />9876543210</p>
              <p><BsEnvelopeFill className="me-2" />info@meditrack.local</p>
              <p><BsClockFill className="me-2" />Mon-Fri: 8am-7pm, Sat: 9am-5pm</p>
            </Col>
            <Col md={4}>
              <h5 className="fw-bold">Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="/" className="text-white text-decoration-none">Home</a></li>
                <li><a href="#about" className="text-white text-decoration-none">About</a></li>
                <li><a href="/login" className="text-white text-decoration-none">Our Doctors</a></li>
                <li><a href="/login" className="text-white text-decoration-none">Book Appointment</a></li>
              </ul>
            </Col>
          </Row>
          <hr className="text-white" />
          <p className="text-center text-white mb-0">© 2025 Meditrack Lite. All rights reserved.</p>
        </Container>
      </div>
    </>
  );
};

export default HomePage;

