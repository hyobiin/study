import { useReducer, useState } from "react";
import { useImmer } from "use-immer";

// useState
const StateEx = () => {
    const [todos, setTodos] = useState([
        { id: 1, text: '할 일', done: false },
    ]);

    const add = (newText) => setTodos(prev => [...prev, { id: Date.now(), text: newText, done: true }]);
    const toggle = (id) => setTodos(prev => [...prev.map(todo => todo.id === id ? {...todo, done: !todo.done} : todo )]);
    const remove = (id) => setTodos(prev => prev.filter(todo => todo.id !== id));

    return(
        <>
            <button onClick={() => {add('새 할 일')}}>add</button>
            {todos.filter(v => v.done).map(todo => (
                <div key={todo.id}>
                    <div>{todo.text}</div>
                    <button onClick={() => {toggle(todo.id)}}>toggle</button>
                    <button onClick={() => {remove(todo.id)}}>remove</button>
                </div>
            ))}
        </>
    )
};

// useReducer
const ReducerEx = () => {
    const reducer = (state, action) => {
        switch(action.type){
            case 'ADD':
                return([...state,
                    { id: Date.now(), text: '새 일 reducer', done: true }
                ]);
            case 'TOGGLE':
                return([...state.map(todo => todo.id === action.id ? {...todo, done: !todo.done} : todo)]);
            case 'REMOVE':
                return([...state.filter(todo => todo.id !== action.id)]);
            default:
                return state;
        }
    }

    const [todos, dispatch] = useReducer(reducer,[
            { id: 1, text: '할 일', done: true },
            { id: 2, text: '할 일2', done: true },
    ]);

    const add = () => { dispatch ({ type: 'ADD' })};
    const toggle = id => dispatch({ type: 'TOGGLE', id });
    const remove = id => dispatch({ type: 'REMOVE', id });

    return(
        <>
            <button onClick={add}>reducer add</button>
            {todos.filter(v => v.done).map(data => (
                <div key={data.id}>
                    {data.text}
                    <button onClick={() => toggle(data.id)}>toggle</button>
                    <button onClick={() => remove(data.id)}>remove</button>
                </div>
            ))}
        </>
    )
};

// useImmer
const ImmerEx = () => {
    const [todos, update] = useImmer([
        { id: 1, text: '할 일', done: true },
        { id: 2, text: '할 일2', done: false }
    ]);

    // 항목 추가
    const add = () => update(draft => {
        draft.push({ id: Date.now(), text: '새 일 immer', done: true });
    });

    // done 상태 토글
    const toggle = id => update(draft => {
        const todo = draft.find(x => x.id === id);
        if (todo) {
            todo.done = !todo.done;
        }
    });

    // 항목 삭제
    const remove = id => update(draft => {
        const index = draft.findIndex(x => x.id === id);
        if (index !== -1) draft.splice(index, 1);
    });

    return (
        <>
            <button onClick={add}>immer add</button>
            {todos.filter(v => v.done).map(data => (
                <div key={data.id}>
                    {data.text}
                    <button onClick={() => toggle(data.id)}>toggle</button>
                    <button onClick={() => remove(data.id)}>remove</button>
                </div>
            ))}
        </>
    );
};

export { StateEx, ReducerEx, ImmerEx };