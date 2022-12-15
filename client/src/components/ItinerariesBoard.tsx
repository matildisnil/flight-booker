import ItineraryCard from './ItineraryCard'
import { Typography, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useNavigate } from "react-router-dom"
import { Box } from '@mui/system';

import { confirmTripData } from '../redux/confirmedTripData/slices';


const ItinerariesBoard = () => {
  const responseData = useAppSelector(state => state.responseData);
  const navigate = useNavigate();
  const itineraryChoice = useAppSelector(state => state.itineraryChoice);
  const formData = useAppSelector(state => state.formData);
  const dispatch = useAppDispatch();

  const calculateTotalPrice = (outboundIndex: number, returnIndex: number | null, numAdults:string, numChildren:string) => {
    let price = 0;
    price += responseData.outboundTrip.itineraries[outboundIndex].prices[0].adult *(+numAdults) 
    + responseData.outboundTrip.itineraries[outboundIndex].prices[0].child *(+numChildren);
    if(returnIndex !== null){
      price += responseData.returnTrip.itineraries[returnIndex].prices[0].adult *(+numAdults) 
      + responseData.returnTrip.itineraries[returnIndex].prices[0].child *(+numChildren);
    }
    return price + ' ' + responseData.outboundTrip.itineraries[outboundIndex].prices[0].currency;
  }

  const handleBook = () => {
    if (itineraryChoice.outboundTripIndex === null || (formData.returnTrip && itineraryChoice.returnTripIndex === null)) {
      return alert('Please select trip(s)');
    }
    const totalPrice = calculateTotalPrice(itineraryChoice.outboundTripIndex, itineraryChoice.returnTripIndex, formData.numberOfAdults, formData.numberOfChildren)
    const returnItinerary = itineraryChoice?.returnTripIndex ? responseData.returnTrip.itineraries[itineraryChoice.returnTripIndex]: null;
    const bookingObject = {
      outboundItinerary: responseData.outboundTrip.itineraries[itineraryChoice.outboundTripIndex],
      returnItinerary: returnItinerary,
      adultPassengers: +formData.numberOfAdults,
      childPassengers: +formData.numberOfChildren,
      totalPrice: totalPrice,
    }
    dispatch(confirmTripData(bookingObject));
    navigate('booking');
  }


  if (responseData.outboundTrip.itineraries.length === 0 && responseData.message.length === 0 && responseData.outboundTrip.message.length === 0) {
    return null
  }

  return (
    <div className="home">
      {
        responseData.message.length !== 0 && <Typography>{responseData.message}</Typography>
      }
      <div>
        <Typography variant="h4" component="h2" align="center">Outbound trips</Typography>
        {
          responseData.outboundTrip.itineraries.length !== 0 ?
            responseData.outboundTrip.itineraries.map((itinerary, index) => <ItineraryCard key={"outbound" + index} itinerary={itinerary} index={index} direction="outboundTripIndex" />)
            :
            responseData.outboundTrip.message
        }
      </div>
      <div>
        {formData.returnTrip &&
          <Typography variant="h4" component="h2" align="center">Return trips</Typography>
        }
        {
          responseData.returnTrip.itineraries.length !== 0 ?
            responseData.returnTrip.itineraries.map((itinerary, index) => <ItineraryCard key={"returnTrip" + index} itinerary={itinerary} index={index} direction="returnTripIndex" />)
            :
            responseData.returnTrip.message
        }
      </div>
      <Box textAlign="center" sx={{ mb: 6, mt: 3 }}>
        <Button variant="contained" size="large" sx={{ py: 1.5, px: 5 }} onClick={handleBook}>Book</Button>
      </Box>
    </div>
  )
}

export default ItinerariesBoard