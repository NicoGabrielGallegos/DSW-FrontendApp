import { FormControl, InputLabel } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SxProps, Theme } from "@mui/material/styles";

export default function ControlledSelect({ id, label = null, value, onChange, size, variant = "outlined", options, sx }: { id: string, label?: string | null, value: string, onChange: (event: any, newValue: any) => void, size?: "small" | "medium", variant?: "standard" | "filled" | "outlined", options: { value: any, text: string }[], sx?: SxProps<Theme> | undefined }) {
    return (
        <FormControl fullWidth>
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Select
                labelId={`${id}-label`}
                value={value}
                onChange={onChange}
                id={id}
                label={label}
                sx={{textAlign: "left", ...sx}}
                variant={variant}
                size={size}
            >
                {options.map((option, idx) => {
                    return (
                        <MenuItem value={option.value} key={idx}>{option.text}</MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}