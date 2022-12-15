import { Typography } from '@mui/material';
import { useAppSelector } from '../redux/hooks';
import '../styles/Confirmation.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ConfirmationPassengers = () => {
  const passengerData = useAppSelector(state => state.passengerData);
  // const responseData = useAppSelector(state => state.responseData);
  // const itineraryChoice = useAppSelector(state => state.itineraryChoice);
  // if (itineraryChoice.outboundTripIndex === null) {
  //   return <div>'Something went wrong, please return to the first page' </div>;
  // }
  // const outboundTripIndex = itineraryChoice.outboundTripIndex;
  // const outboundTrip = responseData.outboundTrip.itineraries[outboundTripIndex]

  return (
    <div>
    <Typography variant="h4" component="h3" align="center">Passengers</Typography>
    <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="passengers details">
            <TableHead>
              <TableRow>
                <TableCell>Passenger</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Date of birth</TableCell>
                <TableCell align="right">Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {passengerData.map((passenger, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Passenger {index + 1}, {passenger.adult ? 'Adult' : 'Child'}
                  </TableCell>
                  <TableCell align="right">{passenger.firstName + ' ' + passenger.lastName}</TableCell>
                  <TableCell align="right">{passenger.doB}</TableCell>
                  <TableCell align="right">{passenger.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
  )
}

export default ConfirmationPassengers