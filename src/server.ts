import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flightData from '../flightData.json';
dotenv.config();

interface IItinerary {
  pointOfDeparture: string,
  pointOfArrival: string,
  departureAt: string,
  arrivalAt: string,
  availableSeats: number,
  prices: { currency: string, adult: number, child: number }[]
}

interface TripObject {
  itineraries: IItinerary[],
  message: string,
}

interface ResponseData {
  outboundTrip: TripObject,
  returnTrip: TripObject,
  message: string,
}

const app: Express = express();
const port = process.env.PORT || 8000;

interface IQuery {
  departureDate: string,
  returnDate?: string,
  origin: string,
  destination: string,
  numPassengers: string,
}

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

const findItineraries = (pointOfOrigin: string, pointOfArrival: string, travelDate: string, numPassengers: string) => {
  const tripObject: TripObject = { itineraries: [], message: '' }
  const flight = flightData.find(flight => flight.depatureDestination === pointOfOrigin && flight.arrivalDestination === pointOfArrival);
  if (!flight) {
    tripObject.message = 'There are no flights between those cities'
    return tripObject;
  }
  const itinerariesOutbound = flight?.itineraries.filter(itinerary => {
    return itinerary.depatureAt.substring(0, 10) === travelDate && (itinerary.avaliableSeats >= +numPassengers);
  })
  if (!itinerariesOutbound) {
    tripObject.message = 'There are no flights with enough available seats on the chosen date'
    return tripObject;
  }
  console.log(itinerariesOutbound);
  if (flight && itinerariesOutbound) {
    const formattedFlights = itinerariesOutbound.map(itinerary => {
      return {
        pointOfDeparture: flight.depatureDestination,
        pointOfArrival: flight.arrivalDestination,
        departureAt: itinerary.depatureAt,
        arrivalAt: itinerary.arriveAt,
        availableSeats: itinerary.avaliableSeats,
        prices: itinerary.prices,
      }
    })
    tripObject.itineraries = formattedFlights;
    return tripObject;
  }
  tripObject.message = 'Something went wrong';
  return tripObject;
}

app.get('/', (req: Request<{}, {}, {}, IQuery>, res: Response) => {
  // kanske slänga in en check så att queryn verkligen ser ut som den ska?
  // if(!departureDate){
  //   return res.json({message: 'Please provide a departure date'});
  // }
  const responseObject: ResponseData = { outboundTrip: {itineraries: [], message: ''}, returnTrip: {itineraries: [], message: ''}, message: '' }

  try {
    console.log(req.query?.returnDate, 'returndategate')
    responseObject.outboundTrip = findItineraries(req.query.origin, req.query.destination, req.query.departureDate, req.query.numPassengers);
    if(req.query.returnDate){
      responseObject.returnTrip = findItineraries(req.query.destination, req.query.origin, req.query.returnDate, req.query.numPassengers);
    }
    return res.json(responseObject);
    } catch (err) {
      console.log(err);
      responseObject.message = 'Something went wrong'
      return res.status(500).json(responseObject);
    }
  });

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});