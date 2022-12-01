import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flightData from '../flightData.json';
dotenv.config();

interface IItinerary {
  flight_id: string,
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

interface RequestObject {
  outboundTrip: RequestTrip,
  returnTrip: RequestTrip | null,
}

interface RequestTrip {
  arrivalAt: string,
  departureAt: string,
  pointOfArrival: string,
  pointOfDeparture: string,
  numberOfPassengers: number,
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
app.use(express.json());

const formatString = (str: string) =>{
  return str[0]?.toUpperCase() + str.slice(1).toLowerCase();
}

const timeout = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

const findItineraries = (pointOfOrigin: string, pointOfArrival: string, travelDate: string, numPassengers: string) => {
  const tripObject: TripObject = { itineraries: [], message: '' }
  const flight = flightData.find(flight => flight.depatureDestination === pointOfOrigin && flight.arrivalDestination === pointOfArrival);
  if (!flight) {
    tripObject.message = 'There are no flights between those cities'
    return tripObject;
  }
  const itineraries = flight?.itineraries.filter(itinerary => {
    return itinerary.depatureAt.substring(0, 10) === travelDate && (itinerary.avaliableSeats >= +numPassengers);
  })
  if (itineraries.length === 0) {
    tripObject.message = 'There are no suitable flights on the chosen date'
    return tripObject;
  }
  console.log(itineraries);
  if (flight && itineraries) {
    const formattedFlights = itineraries.map(itinerary => {
      return {
        flight_id: flight.flight_id,
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

app.get('/', async (req: Request<{}, {}, {}, IQuery>, res: Response) => {
  // kanske slänga in en check så att queryn verkligen ser ut som den ska?
  // if(!departureDate){
  //   return res.json({message: 'Please provide a departure date'});
  // }
  const responseObject: ResponseData = { outboundTrip: {itineraries: [], message: ''}, returnTrip: {itineraries: [], message: ''}, message: '' }
  const wait = timeout(3000);

  try {
    // fungerar det att göra så här?
    const formattedOrigin = formatString(req.query.origin);
    const formattedDestination = formatString(req.query.destination);
    console.log(req.query?.returnDate, 'returndategate')
    responseObject.outboundTrip = findItineraries(formattedOrigin, formattedDestination, req.query.departureDate, req.query.numPassengers);
    if(req.query.returnDate){
      responseObject.returnTrip = findItineraries(formattedDestination, formattedOrigin, req.query.returnDate, req.query.numPassengers);
    }
    await wait;
    return res.json(responseObject);
    } catch (err) {
      console.log(err);
      responseObject.message = 'Something went wrong'
      await wait;
      return res.status(500).json(responseObject);
    }
  });

const bookItinerary = (tripObject: RequestTrip) => {
  const flight = flightData.find(flight => flight.depatureDestination === tripObject.pointOfDeparture && flight.arrivalDestination === tripObject.pointOfArrival);
  const itinerary = flight?.itineraries.find(itinerary => itinerary.depatureAt === tripObject.departureAt && itinerary.arriveAt === tripObject.arrivalAt )
  if (flight && itinerary){
    itinerary.avaliableSeats -= tripObject.numberOfPassengers
  }
}

app.patch('/', (req: Request<{}, {}, RequestObject>, res: Response) => {
  console.log(req.body, 'requestBody');
  try {
    bookItinerary(req.body.outboundTrip);
    if(req.body.returnTrip){
      bookItinerary(req.body.returnTrip);
    }
    res.status(204).json({});
  } catch (err){
    res.status(500).json({error: 'Something went wrong'});
  }
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

