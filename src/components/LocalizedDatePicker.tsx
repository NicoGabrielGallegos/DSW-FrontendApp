import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { PickerValue } from '@mui/x-date-pickers/internals';

export default function LocalizedDatePicker({ label, value, onChange, clearable }: { label: string, value?: PickerValue, onChange: (value: PickerValue) => void, clearable: boolean}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={value}
        onChange={onChange}
        label={label}
        format="dd/MM/yyyy"
        slotProps={{
          textField: { size: "small", fullWidth: true },
          field: { clearable }
        }}
      />
    </LocalizationProvider>
  );
}