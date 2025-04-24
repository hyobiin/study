const InputWrapper = ({
    id,
    label,
    children,
    className = '',
}) => (
    <div className={`input-box ${className}`}>
        {children}
        {label && <label htmlFor={id}>{label}</label>}
    </div>
)

export default InputWrapper;