import { useRef, useState } from "react"

const RefEx = () => {
    const inputRef = useRef();

    const handleFocus = () => {
        inputRef.current.focus();
    };

    return(
        <>
            <input ref={inputRef} type="text" />
            <button onClick={handleFocus}>포커스</button>
        </>
    )
}

const RefCount = () => {
    const renderCount = useRef(1);
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value);
        renderCount.current += 1;
    };

    return(
        <>
            <input value={value} onChange={handleChange} />
            <p>렌더링 횟수: {renderCount.current}</p>
        </>
    )
}

export { RefEx, RefCount };