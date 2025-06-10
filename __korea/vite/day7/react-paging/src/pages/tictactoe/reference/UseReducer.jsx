import React, { useReducer } from 'react';

const initialState = {
    count: 0,
    loading: false,
    error: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { ...state, count: state.count + 1 };
        case 'DECREMENT':
            return { ...state, count: state.count - 1 };
        case 'LOADING_START':
            return { ...state, loading: true, error: null };
        case 'LOADING_SUCCESS':
            return { ...state, loading: false };
        case 'LOADING_ERROR':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);

    // 버튼 클릭 시 모의 비동기 작업 예시
    const simulateLoading = () => {
        dispatch({ type: 'LOADING_START' });

        setTimeout(() => {
            // 성공 시
            dispatch({ type: 'LOADING_SUCCESS' });

            // 실패 시 (주석 해제하고 테스트 가능)
            // dispatch({ type: 'LOADING_ERROR', payload: '오류 발생!' });
        }, 1000);
    };

    return (
        <div>
            <h2>Count: {state.count}</h2>
            {state.loading && <p>로딩 중...</p>}
            {state.error && <p style={{ color: 'red' }}>에러: {state.error}</p>}
            <button onClick={() => dispatch({ type: 'DECREMENT' })} disabled={state.loading}>-</button>
            <button onClick={() => dispatch({ type: 'INCREMENT' })} disabled={state.loading}>+</button>
            <button onClick={simulateLoading} disabled={state.loading}>비동기 작업 시작</button>
        </div>
    );
}

export default Counter;