import React from 'react'
import InputWrapper from "./internal/InputWrapper"

const Radio = ({
    type='radio',
    id,
    name,
    checked,
    onChange,
    label,
    value,
    className = ''
}) => {

    return(
        <InputWrapper id={id} label={label} className={`radio-box ${className}`}>
            <input type={type} id={id} name={name} checked={checked} onChange={onChange} value={value} />
        </InputWrapper>
    )
}

export default Radio