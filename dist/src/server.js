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
app.use(express_1.default.json());
const findItineraries = (pointOfOrigin, pointOfArrival, travelDate, numPassengers) => {
    const tripObject = { itineraries: [], message: '' };
    const flight = flightData_json_1.default.find(flight => flight.depatureDestination === pointOfOrigin && flight.arrivalDestination === pointOfArrival);
    if (!flight) {
        tripObject.message = 'There are no flights between those cities';
        return tripObject;
    }
    const itineraries = flight === null || flight === void 0 ? void 0 : flight.itineraries.filter(itinerary => {
        return itinerary.depatureAt.substring(0, 10) === travelDate && (itinerary.avaliableSeats >= +numPassengers);
    });
    if (itineraries.length === 0) {
        tripObject.message = 'There are no suitable flights on the chosen date';
        return tripObject;
    }
    console.log(itineraries);
    if (flight && itineraries) {
        const formattedFlights = itineraries.map(itinerary => {
            return {
                pointOfDeparture: flight.depatureDestination,
                pointOfArrival: flight.arrivalDestination,
                departureAt: itinerary.depatureAt,
                arrivalAt: itinerary.arriveAt,
                availableSeats: itinerary.avaliableSeats,
                prices: itinerary.prices,
            };
        });
        tripObject.itineraries = formattedFlights;
        return tripObject;
    }
    tripObject.message = 'Something went wrong';
    return tripObject;
};
app.get('/', (req, res) => {
    var _a;
    // kanske slänga in en check så att queryn verkligen ser ut som den ska?
    // if(!departureDate){
    //   return res.json({message: 'Please provide a departure date'});
    // }
    const responseObject = { outboundTrip: { itineraries: [], message: '' }, returnTrip: { itineraries: [], message: '' }, message: '' };
    try {
        console.log((_a = req.query) === null || _a === void 0 ? void 0 : _a.returnDate, 'returndategate');
        responseObject.outboundTrip = findItineraries(req.query.origin, req.query.destination, req.query.departureDate, req.query.numPassengers);
        if (req.query.returnDate) {
            responseObject.returnTrip = findItineraries(req.query.destination, req.query.origin, req.query.returnDate, req.query.numPassengers);
        }
        return res.json(responseObject);
    }
    catch (err) {
        console.log(err);
        responseObject.message = 'Something went wrong';
        return res.status(500).json(responseObject);
    }
});
const bookItinerary = (tripObject) => {
    const flight = flightData_json_1.default.find(flight => flight.depatureDestination === tripObject.pointOfDeparture && flight.arrivalDestination === tripObject.pointOfArrival);
    const itinerary = flight === null || flight === void 0 ? void 0 : flight.itineraries.find(itinerary => itinerary.depatureAt === tripObject.departureAt && itinerary.arriveAt === tripObject.arrivalAt);
    if (flight && itinerary) {
        itinerary.avaliableSeats -= tripObject.numberOfPassengers;
    }
};
app.patch('/', (req, res) => {
    console.log(req.body, 'requestBody');
    try {
        bookItinerary(req.body.outboundTrip);
        if (req.body.returnTrip) {
            bookItinerary(req.body.returnTrip);
        }
        res.status(204).json({});
    }
    catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
//# sourceMappingURL=server.js.map