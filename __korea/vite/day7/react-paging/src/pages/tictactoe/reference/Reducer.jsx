// reducer
function reducer(state, action) { // state는 현재 상태, action은 어떤 동작을 할지 알려주는 객체 { type: 'INCREMENT' }
    switch (action.type) { // action.type에 따라 다른 동작 수행
        case 'INCREMENT':
            return { count: state.count + 1 };
        case 'DECREMENT':
            return { count: state.count - 1 };
        default:
            return state; // 현재 상태 반환
    }
}

let state = { count: 0 }; // 얘가 없으면 state = undefined

state = reducer(state, { type: 'INCREMENT' });
console.log(state); // { count: 1 }


// useReducer
import React, { useReducer } from 'react';

const initialState = { count: 0 }; // 초기 상태값, 추후에 loading, error 등 추가 가능

function reducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + 1 };
        case 'DECREMENT':
            return { count: state.count - 1 };
        default:
            return state;
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);
    /*
        - state: 현재 상태값
        - dispatch: 액션을 보내는 함수
        - reducer: 액션에 따라 상태를 업데이트 하는 함수
        - initialState: 초기 상태값
    */

    return (
        <div>
            <h2>Count: {state.count}</h2>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
        </div>
    );
}

export default Counter;
