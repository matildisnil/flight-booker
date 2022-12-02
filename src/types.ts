export interface IPriceObject {
  currency: string, adult: number, child: number
}
export interface IDataBaseItinerary {
  depatureAt: string,
  arriveAt: string,
  avaliableSeats: number,
  prices: IPriceObject[],
}

// interface IItinerary {
//   flight_id: string,
//   pointOfDeparture: string,
//   pointOfArrival: string,
//   departureAt: string,
//   arrivalAt: string,
//   availableSeats: number,
//   prices: { currency: string, adult: number, child: number }[]
// }

export interface IItinerary {
  flight_id: string,
  pointOfDeparture: string,
  pointOfArrival: string,
  departureAt: string,
  arrivalAt: string,
  availableSeats: number,
  prices: IPriceObject[],
  totalPriceInSEK: string,
}

export interface TripObject {
  itineraries: IItinerary[],
  message: string,
}

export interface ResponseData {
  outboundTrip: TripObject,
  returnTrip: TripObject,
  passengers: { adults: string, children: string },
  message: string,
}

export interface RequestObject {
  outboundTrip: IItinerary,
  returnTrip: IItinerary | null,
  numberOfPassengers: number
}

export interface IQuery {
  departureDate: string,
  returnDate?: string,
  origin: string,
  destination: string,
  // numPassengers: string,
  numAdults: string,
  numChildren: string,
}