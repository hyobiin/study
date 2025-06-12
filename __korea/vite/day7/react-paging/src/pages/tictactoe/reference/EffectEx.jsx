import { useCallback, useMemo, useState, useEffect } from "react"

// useEffect
const EffectEx = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if(count % 2 === 0){
            console.log('짝수');
        }
    }, [count]);

    return <button onClick={() => setCount(c => c + 1)}>Click: {count}</button>;
}

// useCallback
const CallbackEx = () => {
    const [count, setCount] = useState(0);

    const handleClick = useCallback(() => {
        const next = count + 1;
        setCount(next);
        if(next % 2 === 0){
            console.log('짝수');
        }
    }, [count]);

    return <button onClick={handleClick}>Click: {count}</button>;
}

// useMemo
const MemoEx = () => {
    const [count, setCount] = useState(0);

    const isEven = useMemo(() => {
        console.log('짝수');
        return count % 2 === 0;
    }, {count});

    return(
        <>
            <button onClick={() => setCount(c => c + 1)}>Click: {count}</button>
            {isEven ? <span>짝수</span> : <span>홀수</span>}
        </>
    )
}

export { EffectEx, CallbackEx, MemoEx }