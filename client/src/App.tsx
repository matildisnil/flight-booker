import React from 'react';
// import './App.css';
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import { Container } from '@mui/system';

function App() {
  // const [flightData, setFlightData] = useState<IResponseData>({ outboundTrip: { itineraries: [], message: '' }, returnTrip: { itineraries: [], message: '' }, message: '' });

  return (
    <Container sx={{ width: 0.7 }} className="app__container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="booking" element={<Booking />} />
        <Route path="booking/confirmation" element={<Confirmation />} />
      </Routes>
    </Container>
  );
}

export default App;
