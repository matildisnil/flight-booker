import React from 'react'
import { Typography, Paper, Box } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import dayjs from 'dayjs';
import { IItinerary } from '../types';

const ConfirmationFlightInfoCard = ({ itinerary, title }: { itinerary: IItinerary, title: string }) => {
  const getDuration = (itinerary: IItinerary | null) => {
    const date1 = dayjs(itinerary?.departureAt)
    const date2 = dayjs(itinerary?.arrivalAt);
    const durationInMinutes = date2.diff(date1, 'm');
    return Math.floor(durationInMinutes / 60) + 'h' + durationInMinutes % 60 + 'min';
  }

  const duration = getDuration(itinerary);
  return (
    <div>
      <Typography variant="h4" component="h3" align="center">{title}</Typography>
      <Paper className="confirmationFlightInfoCard">
        <div className="flightCard__header">
          <Typography variant="body1">{dayjs(itinerary.departureAt).format('DD-MM-YYYY')}</Typography>
          <Typography variant="body2">{duration}</Typography>
        </div>
        <Timeline className="confirmationFlightInfoCard__timeline"
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent><Box component="span" fontWeight='bold'>{dayjs(itinerary.departureAt).format('HH:mm')}</Box> {' ' + itinerary.pointOfDeparture}</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
            </TimelineSeparator>
            <TimelineContent><Box component="span" fontWeight='bold'>{dayjs(itinerary.arrivalAt).format('HH:mm')}</Box> {' ' + itinerary.pointOfArrival}</TimelineContent>
          </TimelineItem>
        </Timeline>
      </Paper>
    </div>
  )
}

export default ConfirmationFlightInfoCard