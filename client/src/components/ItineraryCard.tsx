import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { chooseItinerary } from '../redux/itineraryChoice/slices';
import { IItinerary } from '../types';
import { Divider } from '@mui/material';

export default function BasicCard({ itinerary, index, direction }: { itinerary: IItinerary, index: number, direction: string }) {
  const [isExpanded, setIsExpanded] = useState<Boolean>(false)
  const date1 = dayjs(itinerary.departureAt)
  const date2 = dayjs(itinerary.arrivalAt);
  const durationInMinutes = date2.diff(date1, 'm');
  const duration = Math.floor(durationInMinutes / 60) + 'h' + durationInMinutes % 60;
  const dispatch = useAppDispatch();
  const selectedTrip = useAppSelector(state => state.itineraryChoice[direction]);

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev)
  }

  const handleSelectFlight = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(chooseItinerary({ direction, index }));
  }

  return (
    <Card sx={{ minWidth: 275 }} className="card" >

      <CardContent className="card__content" onClick={toggleExpanded}>
        {/* <CardActionArea > */}
        <div className="card_leftDiv">
          <Typography variant="body1" component="p">
            {itinerary.pointOfDeparture + '-' + itinerary.pointOfArrival}
          </Typography>
          <Typography variant="body1" component="p" sx={{ fontWeight: 'bold' }}>
            {dayjs(itinerary.departureAt).format('HH:mm') + '-' + dayjs(itinerary.arrivalAt).format('HH:mm')}
          </Typography>
          {isExpanded &&
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {'Available seats: ' + itinerary.availableSeats}
            </Typography>}
        </div>
        <Typography>{duration}</Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        <div className="card_rightDiv">
          <Typography variant="body2">
            {'Price: ' + itinerary.prices[0].adult.toString() + itinerary.prices[0].currency}
          </Typography>
          {isExpanded &&
            <div>
              <Typography variant="body2">
                {'Price (children): ' + itinerary.prices[0].child.toString() + itinerary.prices[0].currency}
              </Typography>
              <Typography variant="body2">
                {'Total price: ' + itinerary.totalPriceInSEK }
              </Typography>
            </div>
          }
          {isExpanded &&
            <CardActions>
              <Button size="small" variant="contained" onClick={handleSelectFlight} className="card__button">{index === selectedTrip ? "Trip selected" : "Select Flight"}</Button>
            </CardActions>
          }
        </div>
      </CardContent>
      {/* </CardActionArea> */}
      {/* {isExpanded && <CardActions className="card__buttonContainer">
        
      </CardActions>} */}
    </Card>
  );
}