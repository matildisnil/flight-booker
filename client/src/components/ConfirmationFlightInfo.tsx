import React from 'react'
import { Typography, Paper, Box } from '@mui/material';
import { useAppSelector } from '../redux/hooks'
import dayjs from 'dayjs';
import { IItinerary } from '../types';
import MoreVert from '@mui/icons-material/MoreVert';
import ConfirmationFlightInfoCard from './ConfirmationFlightInfoCard';

const ConfirmationFlightInfo = () => {
  const itineraryChoice = useAppSelector(state => state.itineraryChoice);
  const responseData = useAppSelector(state => state.responseData);

  const outboundTrip = itineraryChoice.outboundTripIndex !== null ? responseData.outboundTrip.itineraries[itineraryChoice.outboundTripIndex] : null;

  const returnTrip = itineraryChoice.returnTripIndex !== null ? responseData.returnTrip.itineraries[itineraryChoice.returnTripIndex] : null;
  return (
    <div className="confirmation__flightInfo">
      {outboundTrip && <ConfirmationFlightInfoCard itinerary={outboundTrip} title="Outbound trip" />}
      
      {returnTrip && <ConfirmationFlightInfoCard itinerary={returnTrip} title="Return trip" />}
    </div>
  )
}

export default ConfirmationFlightInfo