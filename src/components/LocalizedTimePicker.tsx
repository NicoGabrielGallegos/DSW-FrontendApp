import type { SxProps, Theme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function LocalizedTimePicker({ label, value, onChange, clearable = false, variant = "outlined", sx }: { label?: string | null, value?: PickerValue, onChange: (value: PickerValue) => void, clearable?: boolean, variant?: "outlined" | "standard", sx?: SxProps<Theme> | undefined }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        value={value}
        onChange={onChange}
        label={label}
        format="HH:mm"
        slotProps={{
          textField: { size: "small", fullWidth: true, variant },
          field: { clearable }
        }}
        sx={sx}
      />
    </LocalizationProvider>
  );
}