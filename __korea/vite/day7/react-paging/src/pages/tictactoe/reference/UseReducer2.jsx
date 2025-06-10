import React, { useReducer } from 'react';

const SAVE_FILTER = 'SAVE_FILTER';
const DELETE_FILTER = 'DELETE_FILTER';

// Reducer 함수
function filterReducer(state, action) {
    console.log('🔥 이전 상태:', state);
    console.log('🎯 액션:', action);

    switch (action.type) {
        case SAVE_FILTER:
            console.log('✅ 새 필터 저장됨:', action.container);
            return action.container;

        case DELETE_FILTER:
            console.log('🗑️ 필터 삭제됨');
            return null;

        default:
            return state;
    }
}

// 초기 상태
const initialFilter = null;

export default function FilterExample() {
    const [savedFilter, dispatch] = useReducer(filterReducer, initialFilter);

    const filterA = { keyword: 'React', category: 'Frontend' };
    const filterB = { keyword: 'Spring', category: 'Backend' };

    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            <h2>Saved Filter</h2>
            <pre>{JSON.stringify(savedFilter, null, 2)}</pre>

            <button onClick={() => dispatch({ type: SAVE_FILTER, container: filterA })}>
                Save Filter A
            </button>
            <button onClick={() => dispatch({ type: SAVE_FILTER, container: filterB })}>
                Save Filter B
            </button>
            <button onClick={() => dispatch({ type: DELETE_FILTER })}>
                Delete Filter
            </button>
        </div>
    );
}