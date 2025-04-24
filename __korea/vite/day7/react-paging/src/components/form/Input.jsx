import { forwardRef } from "react";

const Input = forwardRef(
    (
        {
            id,
            type = "text",
            placeholder = "입력해 주세요",
            className = '',
            ...props
        }
        , ref
    ) => {
        return <input id={id} className={className} type={type} placeholder={placeholder} ref={ref} {...props} />;
    }
);

Input.displayName = "Input";

export default Input;