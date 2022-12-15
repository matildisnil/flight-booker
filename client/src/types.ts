import { Dayjs } from 'dayjs';

export interface IItinerary {
  flight_id: string,
  pointOfDeparture: string,
  pointOfArrival: string,
  departureAt: string,
  arrivalAt: string,
  availableSeats: number,
  prices: [{ currency: string, adult: number, child: number }],
  totalPriceInSEK: string,
}

export interface TripObject {
  itineraries: IItinerary[],
  message: string,
}

export interface IResponseData {
  outboundTrip: TripObject,
  returnTrip: TripObject,
  passengers: { adults: string | null, children: string|null },
  message: string,
}

export interface ISelectedTrip {
  [key:string]: number | null,
  // returnTripIndex: number | null,
}
// export interface ISelectedTrip {
//   outboundTripIndex: number | null,
//   returnTripIndex: number | null,
// }

export interface IConfirmedData {
  outboundItinerary: IItinerary | null,
  returnItinerary: IItinerary | null,
  adultPassengers: number,
  // adultPassengers: number | null,
  // childPassengers: number | null,
  childPassengers: number,
  totalPrice: string,
}

export interface IFormData {
  origin: string,
  destination: string,
  returnTrip: Boolean,
  departureDate: Dayjs | null,
  returnDate: Dayjs | null,
  numberOfAdults: string,
  numberOfChildren: string,
}

export interface IFormattedFormData {
  origin: string,
  destination: string,
  returnTrip: Boolean,
  numberOfAdults: string,
  numberOfChildren: string,
  formattedDepartureDate: string | undefined;
  formattedReturnDate: string | undefined;
}

export interface IPassengerData {
  firstName: string, 
  lastName: string,
  doB: string,
  email: string,
  adult: Boolean,
}