import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function LocalizedDatePicker({ label }: { label: string }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker label={label} format="dd/MM/yyyy" slotProps={{textField: {size: "small", fullWidth: true}}} />
    </LocalizationProvider>
  );
}