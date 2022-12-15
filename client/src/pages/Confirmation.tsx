import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useAppSelector } from '../redux/hooks';
import ConfirmationFlightInfo from '../components/ConfirmationFlightInfo';
import '../styles/Confirmation.css';
import ConfirmationPassengers from '../components/ConfirmationPassengers';

const Confirmation = () => {
  const confirmedTripData = useAppSelector(state => state.confirmedTripData);
  const [message, setMessage] = useState('')

  const handleClick = async () => {
    try {
      // const adultPassengers = confirmedTripData.adultPassengers || 0;
      // const childPassengers = confirmedTripData.childPassengers || 0;
      const requestObject = {
        // outboundTrip: {
        //   // arrivalAt: outboundTrip.arrivalAt,
        //   // departureAt: outboundTrip.departureAt,
        //   // pointOfArrival: outboundTrip.pointOfArrival,
        //   // pointOfDeparture: outboundTrip.pointOfDeparture,
        //   // numberOfPassengers: passengerData.length,
        // },

        outboundTrip: confirmedTripData.outboundItinerary,
        returnTrip: confirmedTripData.returnItinerary,
        numberOfPassengers: confirmedTripData.adultPassengers + confirmedTripData.childPassengers
      };


      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(requestObject),
      };
      const response = await fetch(`http://localhost:8000`, requestOptions);
      if (response.status === 204) {
        setMessage('Your flight(s) have been booked.');

      }
      // här behövs kanske något annat meddelande också, inte säker på om try-catch fångar requests med 500-status
    } catch (err) {
      setMessage('There was an error');
    }
  }
  return (
    <div>
      <Typography variant="h3" component="h2" align="center" sx={{ mt: 3, mb: 2 }}>Confirm reservation</Typography>
      <Typography variant="body1" align="center" sx={{ mb: 2 }}>Please review passenger information and trip details before finalizing the reservation.</Typography>
      <ConfirmationPassengers />
      <ConfirmationFlightInfo />
      {message.length === 0 ?
        <div className="confirmation__bottomContainer">
          <Typography>Total price: {confirmedTripData.totalPrice}</Typography>
          <Button variant="contained" size="large" onClick={handleClick}>Book</Button>
        </div>
        :
        <Typography variant="body1">{message}</Typography>
      }
    </div>
  )
}

export default Confirmation