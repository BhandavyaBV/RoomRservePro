import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { adminContext } from '../../contexts/AdminProvider';
import { Button } from '@mui/material';

function NavbarComponent() {
  const {isAdminLoggedIn, logout} = useContext(adminContext);
  return (
    <Navbar expand="lg" className="bg-primary">
      <Container>
        <Navbar.Brand ><span className='text-white'><b>RoomReservePro</b></span></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!isAdminLoggedIn &&  <Link to="/feedback" className='text-white ms-4 mt-1 no-underline flex items-center justify-center'>Feedback</Link>}
            {isAdminLoggedIn && <>
            <Link to="/admin/dashboard" className='text-white ms-4 mt-1 no-underline flex items-center justify-center'>Dashboard</Link>
            <Link to="/admin/users" className='text-white ms-4 mt-1 no-underline flex items-center justify-center'>Manage Users</Link>
            <Link to="/admin/rooms" className='text-white ms-4 mt-1 no-underline flex items-center justify-center'>Manage Rooms</Link>
            <Link to="/admin/bookings" className='text-white ms-4 mt-1 no-underline flex items-center justify-center'>Manage Bookings</Link>
            <Link to="/admin/feedbacks" className='text-white ms-4 mt-1 no-underline flex items-center justify-center'>View Feedbacks</Link>
            </>}
            {/* <Nav.Link>Link</Nav.Link> */}
          </Nav>
          {isAdminLoggedIn && <Button variant='contained' onClick={() => logout()}>Logout</Button>}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;