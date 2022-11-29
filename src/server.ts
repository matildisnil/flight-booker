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

interface ResponseData {
  itinerariesOut: IItinerary[],
  itinerariesReturn: IItinerary[],
  message: string,
}

const app: Express = express();
const port = process.env.PORT || 8000;

interface IQuery {
  departureDate: string,
  returnDate?: string,
  origin: string,
  destination: string,
}

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// const findItineraries = (req: Request<{}, {}, {}, IQuery>, res: Response, responseObject: ResponseData, itinerariesString: string) => {
//   const flight = flightData.find(flight => flight.depatureDestination === req.query.origin && flight.arrivalDestination === req.query.destination);
//   if (!flight) {
//     responseObject.message = 'There are no flights between those cities'
//     return res.json(responseObject);
//   }
//   const itinerariesOutbound = flight?.itineraries.filter(itinerary => {
//     return itinerary.depatureAt.substring(0, 10) === req.query.departureDate
//   })
//   if (!itinerariesOutbound) {
//     responseObject.message = 'There are no flights on the chosen date'
//     return res.json(responseObject);
//   }
//   console.log(itinerariesOutbound);
//   if (flight && itinerariesOutbound) {
//     const formattedFlights = itinerariesOutbound.map(itinerary => {
//       return {
//         pointOfDeparture: flight.depatureDestination,
//         pointOfArrival: flight.arrivalDestination,
//         departureAt: itinerary.depatureAt,
//         arrivalAt: itinerary.arriveAt,
//         availableSeats: itinerary.avaliableSeats,
//         prices: itinerary.prices,
//       }
//     })
//     return formattedFlights;
//   }

  app.get('/', (req: Request<{}, {}, {}, IQuery>, res: Response) => {
    // kanske slänga in en check så att queryn verkligen ser ut som den ska?
    // if(!departureDate){
    //   return res.json({message: 'Please provide a departure date'});
    // }
    const responseObject: ResponseData = { itinerariesOut: [], itinerariesReturn: [], message: '' }

    try {
      console.log(req.query?.returnDate, 'depdategate')

      // responseObject.itinerariesOut = findItineraries(req, res, responseObject, 'itinerariesOut')

      const flight = flightData.find(flight => flight.depatureDestination === req.query.origin && flight.arrivalDestination === req.query.destination);
      if(!flight){
        responseObject.message = 'There are no flights between those cities'
        return res.json(responseObject);
      }
      const itinerariesOut = flight?.itineraries.filter(itinerary => {
        return itinerary.depatureAt.substring(0,10) === req.query.departureDate
      })
      if(!itinerariesOut){
        responseObject.message = 'There are no flights on the chosen date'
        return res.json(responseObject);
      }
      console.log(itinerariesOut);
      if(flight && itinerariesOut) {
        const formattedFlights = itinerariesOut.map(itinerary => {
          return {
            pointOfDeparture: flight.depatureDestination,
            pointOfArrival: flight.arrivalDestination,
            departureAt: itinerary.depatureAt,
            arrivalAt: itinerary.arriveAt,
            availableSeats: itinerary.avaliableSeats,
            prices: itinerary.prices,
          }
        })
        responseObject.itinerariesOut = formattedFlights;

      if (req.query.returnDate) {

      }
      return res.json(responseObject);
    }
    responseObject.message = 'No such flight in our system';
    return res.json(responseObject);
  } catch (err) {
    console.log(err);
    responseObject.message = 'Something went wrong';
    return res.json(responseObject);
  }

});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});