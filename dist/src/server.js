"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const flightData_json_1 = __importDefault(require("../flightData.json"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.urlencoded({ extended: true }));
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
app.get('/', (req, res) => {
    var _a;
    // kanske slänga in en check så att queryn verkligen ser ut som den ska?
    // if(!departureDate){
    //   return res.json({message: 'Please provide a departure date'});
    // }
    const responseObject = { itinerariesOut: [], itinerariesReturn: [], message: '' };
    try {
        console.log((_a = req.query) === null || _a === void 0 ? void 0 : _a.returnDate, 'depdategate');
        // responseObject.itinerariesOut = findItineraries(req, res, responseObject, 'itinerariesOut')
        const flight = flightData_json_1.default.find(flight => flight.depatureDestination === req.query.origin && flight.arrivalDestination === req.query.destination);
        if (!flight) {
            responseObject.message = 'There are no flights between those cities';
            return res.json(responseObject);
        }
        const itinerariesOut = flight === null || flight === void 0 ? void 0 : flight.itineraries.filter(itinerary => {
            return itinerary.depatureAt.substring(0, 10) === req.query.departureDate;
        });
        if (!itinerariesOut) {
            responseObject.message = 'There are no flights on the chosen date';
            return res.json(responseObject);
        }
        console.log(itinerariesOut);
        if (flight && itinerariesOut) {
            const formattedFlights = itinerariesOut.map(itinerary => {
                return {
                    pointOfDeparture: flight.depatureDestination,
                    pointOfArrival: flight.arrivalDestination,
                    departureAt: itinerary.depatureAt,
                    arrivalAt: itinerary.arriveAt,
                    availableSeats: itinerary.avaliableSeats,
                    prices: itinerary.prices,
                };
            });
            responseObject.itinerariesOut = formattedFlights;
            if (req.query.returnDate) {
            }
            return res.json(responseObject);
        }
        responseObject.message = 'No such flight in our system';
        return res.json(responseObject);
    }
    catch (err) {
        console.log(err);
        responseObject.message = 'Something went wrong';
        return res.json(responseObject);
    }
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
//# sourceMappingURL=server.js.map