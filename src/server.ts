import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flightData from './flightData.json';
dotenv.config();
import { IDataBaseItinerary, IItinerary, TripObject, ResponseData, RequestObject, IQuery } from './types'


const app: Express = express();
const port = process.env.PORT || 8000;

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

const calculatePrice = (itinerary: IDataBaseItinerary, numAdults: string, numChildren: string) => {
  if(!itinerary.prices[0] /* || !itinerary.prices[0].adult */){
    return 'Could not calculate price';
  }
  const totalPrice = +(numAdults) * itinerary.prices[0].adult + (+numChildren) * itinerary.prices[0].child;
  return totalPrice.toString() + ' ' + itinerary.prices[0].currency;
}

const timeout = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

const findItineraries = (pointOfOrigin: string, pointOfArrival: string, travelDate: string, numAdults: string, numChildren: string) => {
  const tripObject: TripObject = { itineraries: [], message: '' }
  const numPassengers = +numAdults + (+numChildren);
  const flight = flightData.find(flight => flight.depatureDestination === pointOfOrigin && flight.arrivalDestination === pointOfArrival);
  if (!flight) {
    tripObject.message = 'There are no flights between those cities'
    return tripObject;
  }
  const itineraries: IDataBaseItinerary[] = flight?.itineraries.filter(itinerary => {
    return itinerary.depatureAt.substring(0, 10) === travelDate && (itinerary.avaliableSeats >= +numPassengers);
  })
  if (itineraries.length === 0) {
    tripObject.message = 'There are no suitable flights on the chosen date'
    return tripObject;
  }
  console.log(itineraries);
  if (flight && itineraries.length !== 0) {
    const formattedFlights = itineraries.map(itinerary => {
      const totalPriceInSEK = calculatePrice(itinerary, numAdults, numChildren);
      return {
        flight_id: flight.flight_id,
        pointOfDeparture: flight.depatureDestination,
        pointOfArrival: flight.arrivalDestination,
        departureAt: itinerary.depatureAt,
        arrivalAt: itinerary.arriveAt,
        availableSeats: itinerary.avaliableSeats,
        prices: itinerary.prices,
        totalPriceInSEK,
      }
    })
    tripObject.itineraries = formattedFlights;
    return tripObject;
  }
  tripObject.message = 'Something went wrong';
  return tripObject;
}

app.get('/', async (req: Request<{}, {}, {}, IQuery>, res: Response) => {
  const responseObject: ResponseData = { outboundTrip: {itineraries: [], message: ''}, returnTrip: {itineraries: [], message: ''}, passengers: { adults: req.query.numAdults, children: req.query.numChildren }, message: '' }
  const wait = timeout(3000);

  try {
    // fungerar det att göra så här?
    const formattedOrigin = formatString(req.query.origin);
    const formattedDestination = formatString(req.query.destination);
    console.log(req.query?.returnDate, 'returndategate')
    responseObject.outboundTrip = findItineraries(formattedOrigin, formattedDestination, req.query.departureDate, req.query.numAdults, req.query.numChildren);
    if(req.query.returnDate){
      responseObject.returnTrip = findItineraries(formattedDestination, formattedOrigin, req.query.returnDate, req.query.numAdults, req.query.numChildren);
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

const bookItinerary = (tripObject: IItinerary, numberOfPassengers: number ) => {
  const flight = flightData.find(flight => flight.depatureDestination === tripObject.pointOfDeparture && flight.arrivalDestination === tripObject.pointOfArrival);
  const itinerary = flight?.itineraries.find(itinerary => itinerary.depatureAt === tripObject.departureAt && itinerary.arriveAt === tripObject.arrivalAt )
  if (flight && itinerary){
    console.log(itinerary.avaliableSeats, 'seats before')
    itinerary.avaliableSeats -= numberOfPassengers
    console.log(itinerary.avaliableSeats, 'after')
  }
}

app.patch('/', (req: Request<{}, {}, RequestObject>, res: Response) => {  
  try {
    bookItinerary(req.body.outboundTrip, req.body.numberOfPassengers);
    if(req.body.returnTrip){
      bookItinerary(req.body.returnTrip, req.body.numberOfPassengers);
    }
    res.status(204).json({});
  } catch (err){
    res.status(500).json({error: 'Something went wrong'});
  }
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

