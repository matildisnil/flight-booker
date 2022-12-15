import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { TextField, Typography, Button, Divider, Box } from '@mui/material';
import { submitPassengerData } from '../redux/passengerData/slices';
import { useNavigate } from 'react-router-dom';
import '../styles/Booking.css';

const Booking = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const initialFormData = useAppSelector(state => state.formData);
  
  const confirmedTripData = useAppSelector(state => state.confirmedTripData);
  const adultPassengers = confirmedTripData.adultPassengers ? +confirmedTripData.adultPassengers : 0;
  const childPassengers = confirmedTripData.childPassengers ? +confirmedTripData.childPassengers : 0;
  const initialAdultArray = Array.from({ length: adultPassengers }, () => ({ firstName: '', lastName: '', doB: '', email: '', adult: true }));
  const initialChildArray = Array.from({ length: childPassengers }, () => ({ firstName: '', lastName: '', doB: '', email: '', adult: false }));
  // const initialAdultArray = Array.from({ length: +initialFormData.numberOfAdults }, () => ({ firstName: '', lastName: '', doB: '', email: '', adult: true }));
  // const initialChildArray = Array.from({ length: +initialFormData.numberOfChildren }, () => ({ firstName: '', lastName: '', doB: '', email: '', adult: false }));
  const initialArray = initialAdultArray.concat(initialChildArray);
  const [bookingFormData, setBookingFormData] = useState(initialArray);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    setBookingFormData(prev => {
      return [...prev.slice(0, index), { ...prev[index], [e.target.name]: e.target.value }, ...prev.slice(index + 1)];
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(submitPassengerData(bookingFormData));
    navigate('confirmation');
  }

  return (
    <div className="booking__container">
      <Typography variant="h4" component="h2" align="center" sx={{ mb: 3, mt: 3}}>Please enter passenger information</Typography>
      <form onSubmit={handleSubmit}>
        {bookingFormData.map((passenger, index) => {
          return (
            <div key={'passenger' + index} className="bookingForm__passenger">
              <Divider textAlign="left">Passenger {index + 1}, {passenger.adult ? 'Adult' : 'Child'}</Divider>
              <div className="bookingForm__inputDiv">
              <TextField
                required
                fullWidth
                // id="first-name"
                value={bookingFormData[index].firstName}
                onChange={e => handleChange(e, index)}
                name="firstName"
                label="First name"
                sx={{ margin: 0.5 }}
                className="booking__formInput"
              />
              <TextField
                required
                fullWidth
                // id="last-name"
                value={bookingFormData[index].lastName}
                onChange={e => handleChange(e, index)}
                name="lastName"
                label="Last name"
                sx={{ margin: 0.5 }}
                className="booking__formInput"

              />
              </div>
              <div className="bookingForm__inputDiv">
              <TextField
                required
                fullWidth
                // id="outlined-required"
                value={bookingFormData[index].doB}
                onChange={e => handleChange(e, index)}
                name="doB"
                label="Date of birth"
                sx={{ margin: 0.5 }}
                className="booking__formInput"
              />
              <TextField
                required
                fullWidth
                // id="outlined-required"
                value={bookingFormData[index].email}
                onChange={e => handleChange(e, index)}
                name="email"
                label="Email"
                sx={{ margin: 0.5 }}
                className="booking__formInput"
              />
              </div>
            </div>
          )
        })}

        <Box textAlign="center" sx={{ mb: 6, mt: 3 }}>
        <Button size="large" type="submit" variant="contained" sx={{ py: 1.5, px: 5}} >Proceed with reservation</Button>

      </Box>
      </form>
    </div>
  )
}

export default Booking