import React, { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Button, TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import { IResponseData } from '../types';
import { useAppDispatch } from '../redux/hooks';
import { loadData } from '../redux/responseData/slices'
import { IFormData } from '../types';
import { submitFormData } from '../redux/formData/slices';
import { resetItineraryChoice } from '../redux/itineraryChoice/slices';
import { resetPassengerData } from '../redux/passengerData/slices';



const Form = ({ setLoading }: { setLoading: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [formData, setFormData] = useState<IFormData>({ origin: '', destination: '', returnTrip: false, departureDate: dayjs(new Date('2022-12-12')), returnDate: null, numberOfAdults: '1', numberOfChildren: '0' });
  const dispatch = useAppDispatch();

  const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleOutgoingDateChange = (newValue: Dayjs | null) => {
    setFormData(prev => {
      return { ...prev, departureDate: newValue }
    })
  };

  const handleReturnDateChange = (newValue: Dayjs | null) => {
    setFormData(prev => {
      return { ...prev, returnDate: newValue }
    })
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => {
      if (prev.returnTrip === false) {
        return { ...prev, returnTrip: !prev.returnTrip, returnDate: prev.departureDate?.add(2, 'day') || null }
      }
      return { ...prev, returnTrip: !prev.returnTrip, returnDate: null }
    })
    // setCheckboxState(e.target.checked);
  }

  const handleSelectPassengersChange = (e: SelectChangeEvent) => {
    setFormData(prev => {
      return { ...prev, [e.target.name]: e.target.value as string }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // const response = await fetch(`http://localhost:8000`);
    if (!formData.departureDate || (formData.returnTrip && !formData.returnDate)) {
      return alert('Please select dates');
    }
    const formattedDepartureDate = formData.departureDate.format('YYYY-MM-DD');
    const formattedReturnDate = formData.returnDate?.format('YYYY-MM-DD');
    // const numPassengers = +formData.numberOfAdults + (+formData.numberOfChildren);

    const formattedFormData = {
      origin: formData.origin,
      destination: formData.destination,
      returnTrip: formData.returnTrip,
      numberOfAdults: formData.numberOfAdults,
      numberOfChildren: formData.numberOfChildren,
      formattedDepartureDate,
      formattedReturnDate
    }
    dispatch(submitFormData(formattedFormData));

    const response = await fetch(`http://localhost:8000?origin=${formData.origin}&destination=${formData.destination}&departureDate=${formattedDepartureDate}&${formData.returnTrip ? `returnDate=${formattedReturnDate}` : ''}&numAdults=${formData.numberOfAdults}&numChildren=${formData.numberOfChildren}`);
    const parsedResponse: IResponseData = await response.json();
    dispatch(resetItineraryChoice());
    dispatch(resetPassengerData());
    dispatch(loadData(parsedResponse));
    setLoading(false);
    // setFlightData(parsedResponse);
  }


  return (
    <Paper className="initialForm">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form onSubmit={handleSubmit} className="initialForm__form">
          <div className='initialForm__destinationsDiv'>
            <TextField
              fullWidth
              name="origin"
              label="From"
              value={formData.origin}
              onChange={onFormChange}
              sx={{ mr: 0.4 }}
              className="initialForm__input" />
            <TextField
              fullWidth
              name="destination"
              label="To"
              value={formData.destination}
              onChange={onFormChange}
              sx={{ ml: 0.4 }}
              className="initialForm__input" />
          </div>
          <div className="initialForm__datesDiv">
            <DesktopDatePicker
              label="Date of outgoing trip"
              inputFormat="MM/DD/YYYY"
              value={formData.departureDate}
              onChange={handleOutgoingDateChange}
              className="initialForm__input"
              renderInput={(params) => <TextField {...params} />}
            />
            <FormControlLabel control={<Checkbox sx={{ ml: 0.4, mr: 0.4 }} onChange={handleCheckboxChange} />} label="Roundtrip" />

            <DesktopDatePicker
              label="Date of return trip"
              inputFormat="MM/DD/YYYY"
              value={formData.returnDate}
              onChange={handleReturnDateChange}
              disabled={!formData.returnTrip}
              className="initialForm__input"
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
          <div className="initialForm_bottomDiv">
            <div className="initialForm__selectContainer">
              <FormControl fullWidth>
                <InputLabel id="select-adults-label">Adults (12+)</InputLabel>
                <Select
                  labelId="select-adults-label"
                  id="select-adults"
                  value={formData.numberOfAdults}
                  label="Adults (12+)"
                  name='numberOfAdults'
                  onChange={handleSelectPassengersChange}
                  sx={{ mr: 0.4 }}
                  className="initialForm__input"

                >
                  {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((strNumber, index) => <MenuItem key={'numAdults' + index} value={strNumber}>{strNumber}</MenuItem>)}
                  {/* <MenuItem value={number}>{number}</MenuItem> */}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="select-children-label">Children</InputLabel>
                <Select
                  labelId="select-children-label"
                  id="select-children"
                  value={formData.numberOfChildren}
                  label="Adults"
                  name='numberOfChildren'
                  onChange={handleSelectPassengersChange}
                  sx={{ ml: 0.4 }}

                  className="initialForm__input"

                >
                  {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((strNumber, index) => <MenuItem key={'numChildren' + index} value={strNumber}>{strNumber}</MenuItem>)}
                </Select>
              </FormControl>
            </div>

            <Button type="submit" className="initialForm__input" variant="contained" size="large">Submit</Button>
          </div>
        </form>
      </LocalizationProvider>
    </Paper>
  )
}

export default Form