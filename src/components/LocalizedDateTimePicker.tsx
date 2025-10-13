import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Container from '@mui/material/Container';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Box from '@mui/material/Box';

export default function LocalizedDateTimePicker({ label }: { label: string }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker label={label} format="dd/MM/yyyy - HH:mm" slotProps={{textField: {size: "small", fullWidth: true}}} />
    </LocalizationProvider>
  );
}