"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import dotenv from 'dotenv';
// dotenv.config();
const flightData_json_1 = __importDefault(require("./flightData.json"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const formatString = (str) => {
    var _a;
    return ((_a = str[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) + str.slice(1).toLowerCase();
};
const calculatePrice = (itinerary, numAdults, numChildren) => {
    if (!itinerary.prices[0] /* || !itinerary.prices[0].adult */) {
        return 'Could not calculate price';
    }
    const totalPrice = +(numAdults) * itinerary.prices[0].adult + (+numChildren) * itinerary.prices[0].child;
    return totalPrice.toString() + ' ' + itinerary.prices[0].currency;
};
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const findItineraries = (pointOfOrigin, pointOfArrival, travelDate, numAdults, numChildren) => {
    const tripObject = { itineraries: [], message: '' };
    const numPassengers = +numAdults + (+numChildren);
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
            };
        });
        tripObject.itineraries = formattedFlights;
        return tripObject;
    }
    tripObject.message = 'Something went wrong';
    return tripObject;
};
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const responseObject = { outboundTrip: { itineraries: [], message: '' }, returnTrip: { itineraries: [], message: '' }, passengers: { adults: req.query.numAdults, children: req.query.numChildren }, message: '' };
    const wait = timeout(3000);
    try {
        // fungerar det att göra så här?
        const formattedOrigin = formatString(req.query.origin);
        const formattedDestination = formatString(req.query.destination);
        responseObject.outboundTrip = findItineraries(formattedOrigin, formattedDestination, req.query.departureDate, req.query.numAdults, req.query.numChildren);
        if (req.query.returnDate) {
            responseObject.returnTrip = findItineraries(formattedDestination, formattedOrigin, req.query.returnDate, req.query.numAdults, req.query.numChildren);
        }
        yield wait;
        return res.json(responseObject);
    }
    catch (err) {
        console.log(err);
        responseObject.message = 'Something went wrong';
        yield wait;
        return res.status(500).json(responseObject);
    }
}));
const bookItinerary = (tripObject, numberOfPassengers) => {
    const flight = flightData_json_1.default.find(flight => flight.depatureDestination === tripObject.pointOfDeparture && flight.arrivalDestination === tripObject.pointOfArrival);
    const itinerary = flight === null || flight === void 0 ? void 0 : flight.itineraries.find(itinerary => itinerary.depatureAt === tripObject.departureAt && itinerary.arriveAt === tripObject.arrivalAt);
    if (flight && itinerary) {
        itinerary.avaliableSeats -= numberOfPassengers;
    }
};
app.patch('/', (req, res) => {
    try {
        bookItinerary(req.body.outboundTrip, req.body.numberOfPassengers);
        if (req.body.returnTrip) {
            bookItinerary(req.body.returnTrip, req.body.numberOfPassengers);
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