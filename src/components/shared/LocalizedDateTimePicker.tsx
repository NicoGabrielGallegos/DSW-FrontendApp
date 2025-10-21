import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import type { SxProps, Theme } from '@mui/material/styles';

export default function LocalizedDateTimePicker({ label, value, onChange, clearable = false, variant, sx }: { label?: string | null, value?: PickerValue, onChange: (value: PickerValue) => void, clearable?: boolean, variant?: "outlined" | "standard", sx?: SxProps<Theme> | undefined }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        value={value}
        onChange={onChange}
        label={label}
        format="dd/MM/yyyy - HH:mm"
        slotProps={{
          textField: { size: "small", fullWidth: true, variant },
          field: { clearable }
        }}
        sx={sx}
      />
    </LocalizationProvider>
  );
}