import React from 'react'
import InputWrapper from "./internal/InputWrapper"

const Radio = ({
    type='radio',
    id,
    name,
    checked,
    onChange,
    label,
    className = ''
}) => {

    return(
        <InputWrapper id={id} label={label} className={`radio-box ${className}`}>
            <input type={type} id={id} name={name} />
        </InputWrapper>
    )
}

export default Radio