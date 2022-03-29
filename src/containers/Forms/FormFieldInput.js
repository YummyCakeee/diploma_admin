import React from "react";
import InputField from "components/Elements/InputField/InputField";

const FormFieldInput = (props) => {
    const {
        field: { 
            name,
            onBlur,
            onChange,
            value
        },
        form: { errors, touched, setFieldTouched },
        ...inputProps
    } = props
    const hasError = errors[name] && touched[name]
    return (
        <>
            <InputField
                value={value}
                onChange={(text) => onChange(name)(text)}
                error={hasError ? errors[name] : null}
                onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                }}
                {...inputProps}
            />
        </>
    )
}


export default FormFieldInput