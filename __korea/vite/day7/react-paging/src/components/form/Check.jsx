import React from 'react';
import InputWrapper from './internal/InputWrapper';

const Check = ({
    type='check',
    id,
    name,
    checked,
    onChange,
    label,
    className = ''
}) => {
    const inpId = id || `${name}=${label}`;
    const inpType = type === 'check' ? 'checkbox' : type;

    return(
        <InputWrapper id={inpId} label={label} className={`check-box ${className}`}>
            <input
                type={inpType}
                id={inpId}
                name={name}
                checked={checked}
                onChange={onChange}
            />
        </InputWrapper>
    )
}

export default Check;