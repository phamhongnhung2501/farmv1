import React from "react";
import { Container, Row, Col } from "reactstrap";

const Footer = () => (
  <footer className="footer">
    <Container fluid>
      <Row >
        <Col xs="6" className="text-left">
          <p className="mb-0">
            <span href="/" className="text-center">
              Học viện Công nghệ Bưu chính Viễn thông
            </span>
          </p>
        </Col>
        <Col xs="6" className="text-right">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} -{" "}
            <span href="/" className="text-center">
                Địa điểm: Trang trại Công ty Sunny Việt Nam, xã Thụy Hương, huyện Chương Mỹ, TP.Hà Nội
            </span>
          </p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
