import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import type { SxProps, Theme } from '@mui/material/styles';

export default function LocalizedDatePicker({ label, value, onChange, clearable = false, variant = "outlined", sx }: { label?: string | null, value?: PickerValue, onChange: (value: PickerValue) => void, clearable?: boolean, variant?: "outlined" | "standard", sx?: SxProps<Theme> | undefined }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={value}
        onChange={onChange}
        label={label}
        format="dd/MM/yyyy"
        slotProps={{
          textField: { size: "small", fullWidth: true, variant },
          field: { clearable }
        }}
        sx={sx}
      />
    </LocalizationProvider>
  );
}