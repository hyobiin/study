import React from 'react';

const Checks = ({ type='check', id, name, checked, onChange, label }) => {

    const inpId = id || `${name}=${label}`;

    return(
        <div className="check-wrap">
            <input
                type={type}
                id={inpId}
                name={name}
                checked={checked}
                onChange={onChange}
            />
            <label htmlFor={id}>{label}</label>
        </div>
    )
}

export default Checks;