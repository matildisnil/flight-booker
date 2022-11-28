import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flightData from '../flightData.json';

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 8000;

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.urlencoded({extended: true}));

app.get('/', (req: Request, res: Response) => {
  // const param = req.query.yes;
  // const secondParam = req.query.no;
  console.log(req.query.origin, 'origingate');

  const flight = flightData.find(flight => flight.depatureDestination === req.query.origin && flight.arrivalDestination === req.query.destination);
  console.log(flight && flight.itineraries[0])
  if(flight) {
    const formattedFlights = flight.itineraries.map(itinerary => {
      return {
        pointOfDeparture: flight.depatureDestination,
        pointOfArrival: flight.arrivalDestination,
        departureAt: itinerary.depatureAt,
        arrivalAt: itinerary.arriveAt,
        availableSeats: itinerary.avaliableSeats,
        prices: itinerary.prices,
      }
    })
    return res.json(formattedFlights);
  }
  return res.json({message: 'No such flight in our system'});
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});