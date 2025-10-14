import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField";

export default function ControlledAutocomplete({ id, label, value, onChange, inputValue, onInputChange, options }: { id: string, label: string, value: {id: string, label: string} | null, onChange: (event: any, newValue: any) => void, inputValue: string, onInputChange: (event: any, newValue: any) => void, options: { id: string, label: string }[] }) {
    return (
        <Autocomplete
            value={value}
            onChange={onChange}
            inputValue={inputValue}
            onInputChange={onInputChange}
            id={id}
            disablePortal
            options={options}
            isOptionEqualToValue={(option, value) => {return option.id === value.id && option.label === value.label}}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={label} size="small" />}
        />

    )
}