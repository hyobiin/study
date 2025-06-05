import { useState } from 'react';

export default function RequestTracker() {
    const [pending, setPending] = useState(0);
    const [completed, setCompleted] = useState(0);

    /* TODO:
        1. pending +1
        2. 3초 후 pending은 -1, completed는 +1
    */

    // 함수형으로 상태 업데이트를 해야 안전하고 버그 없음
    async function handleClick() {
        setPending(prev => prev + 1);
        await delay(3000);
        setPending(prev => prev - 1);
        setCompleted(prev => prev + 1);
    }

    return (
        <>
            <h3>Pending: {pending}</h3>
            <h3>Completed: {completed}</h3>
            <button onClick={handleClick}>Buy</button>
        </>
    );
}

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
