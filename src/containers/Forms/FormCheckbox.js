import React from "react"
import Checkbox from "components/Elements/Checkbox/Checkbox"

const FormCheckbox = (props) => {
    const {
        field: { 
            name,
            onBlur,
            onChange,
            value
        },
        form: { 
            errors, 
            touched, 
            setFieldTouched
        },
        ...inputProps
    } = props
    return (
        <Checkbox 
            checked={value === 'true'}
            {...props}
            onCheckChanged={() => onChange(name)(value === 'true' ? 'false' : 'true')}
            onBlur={() => {
                setFieldTouched(name)
                onBlur(name)
            }}
        />
    )
}

export default FormCheckbox