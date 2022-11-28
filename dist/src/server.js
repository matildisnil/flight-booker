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
app.get('/', (req, res) => {
    // const param = req.query.yes;
    // const secondParam = req.query.no;
    console.log(req.query.origin, 'origingate');
    const flight = flightData_json_1.default.find(flight => flight.depatureDestination === req.query.origin && flight.arrivalDestination === req.query.destination);
    console.log(flight && flight.itineraries[0]);
    if (flight) {
        const formattedFlights = flight.itineraries.map(itinerary => {
            return {
                pointOfDeparture: flight.depatureDestination,
                pointOfArrival: flight.arrivalDestination,
                departureAt: itinerary.depatureAt,
                arrivalAt: itinerary.arriveAt,
                availableSeats: itinerary.avaliableSeats,
                prices: itinerary.prices,
            };
        });
        return res.json(formattedFlights);
    }
    return res.json({ message: 'No such flight in our system' });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
//# sourceMappingURL=server.js.map