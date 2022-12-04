import "./css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, Route, Routes } from "react-router-dom";

import Analyzer from "./pages/Analyzer";
import Maxtable from "./pages/Maxtable";
import { Container, Nav, Navbar } from "react-bootstrap";

function App() {
  return (
    <>
      <Navbar fixed="top" bg="dark" variant="dark">
        <Container>
          <NavLink to="/" className="navbar-brand">
            ROA
          </NavLink>
          <Nav className="me-auto">
            <NavLink to="/analyzer" className="nav-link">
              아이템 분석
            </NavLink>
            <NavLink to="/table" className="nav-link">
              옵션표
            </NavLink>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Analyzer />} />
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="/table" element={<Maxtable />} />
      </Routes>
    </>
  );
}

export default App;
