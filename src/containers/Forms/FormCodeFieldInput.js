import React from "react"
import CodeInputField from "components/Elements/CodeInputField/CodeInputField"

const FormCodeFieldInput = (props) => {
    const {
        field: {
            name,
            onBlur,
            onChange,
            value
        },
        form: {
            errors, touched, setFieldTouched
        },
        ...inputProps
    } = props
    const hasError = errors[name] && touched[name]
    return (
        <>
            <CodeInputField 
                value={value}
                onChange={(text) => onChange(name)(text)}
                onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                }}
                error={hasError ? errors[name] : null}
                {...inputProps}
            />
        </>
    )
}


export default FormCodeFieldInput