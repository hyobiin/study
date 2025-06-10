import { useEffect } from "react";
import { useImmer } from "use-immer";

// 정렬, 완료는 따로 보여주기, 날짜 및 순서 추가, localstorage 저장

export default function TodoList(){
    const [todos, setTodos] = useImmer([
        { id: 1, text: '공부', completed: false },
        { id: 2, text: '운동', completed: false },
        { id: 3, text: '청소', completed: false },
    ]);
    const [searchText, setSearchText] = useImmer('');
    const [inputText, setInputText] = useImmer('');
    const [filteredTodos, setFilteredTodos] = useImmer(todos);
    const [editingId, setEditingId] = useImmer(null);
    const [editText, setEditText] = useImmer('');

    function handleAdd(text){
        const lastId = todos.length > 0
            ? Math.max(...todos.map(todo => todo.id))
            : 0;

        setTodos(draft => {
            draft.push({
                id: lastId + 1,
                text
            });
        });

        setInputText('');
        handleShowAll();
    }

    function handleEdit(nextTodo){
        setTodos(todos.map(data => {
            if(data.id === nextTodo.id){
                return nextTodo;
            }else{
                return data;
            }
        }))
    }

    function handleDelete(id){
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }

    function handleCheck(id){
        setTodos(draft => {
            const todo = draft.find(todo => todo.id === id);
            if(todo){
                todo.completed = !todo.completed;
            }
        })
    }

    function handleSearch(){
        const keyword = searchText.trim().toLowerCase();
        if(keyword === ''){
            handleShowAll();
        }else{
            setFilteredTodos((todo) =>
                todos.filter(todo =>
                    todo.text.toLowerCase().includes(keyword)
                )
            );
        }
    }

    function handleShowAll(){
        setFilteredTodos(todos);
    }

    useEffect(() => {
        handleShowAll();
    }, [todos]);

    useEffect(() => {
        if(searchText.trim() === ''){
            handleShowAll();
        }
    }, [searchText]);

    return(
        <>
            <h2>
                Todo List ||
                <span> 총 {todos.length}개</span>
                <span> | 완료 {todos.filter(todo => todo.completed).length}개</span>
            </h2>
            <button onClick={handleShowAll}>__전체 보기</button>
            <hr/>
            <div>
                <input
                    type="text"
                    placeholder="검색어 입력"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter'){
                            handleSearch();
                        }
                    }}
                />
                <button onClick={handleSearch}>검색</button>
            </div>
            <hr/>
            <div>
                <input
                    type="text"
                    placeholder="할 일 입력"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter'){
                            const value = e.target.value.trim();
                            if(value !== ''){
                                handleAdd(value);
                            }
                        }
                    }}
                />
                <button onClick={() => handleAdd(inputText)}>추가</button>
            </div>
            <ul>
                {filteredTodos.map(data => (
                    <li
                        key={data.id}
                        style={data.completed ? { textDecoration: 'line-through' } : {}}
                    >
                        {editingId === data.id ? (
                            <>
                                <input
                                    type="text"
                                    id="inpEdit"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if(e.key === 'Enter'){
                                            handleEdit({ ...data, text: editText });
                                            setEditingId(null);
                                        }
                                    }}
                                    onBlur={() => {
                                        handleEdit({ ...data, text: editText });
                                        setEditingId(null);
                                    }}
                                    autoFoucus
                                />
                                <button
                                    onClick={() =>{
                                        handleEdit({ ...data, text: editText });
                                        setEditingId(null);
                                    }}>
                                    수정 완료
                                </button>
                            </>
                        ) : (
                            <span>{data.text}</span>
                        )}
                        <button
                            onClick={() => {
                                setEditingId(data.id);
                                setEditText(data.text);
                            }}
                        >수정</button>
                        <button
                            onClick={() => handleCheck(data.id)}
                            style={{
                                marginLeft: '10px',
                                backgroundColor: data.completed ? 'green' : '',
                                color: data.completed ? 'white' : '',
                            }}
                        >
                            {data.completed ? '완료' : '미완료'}
                        </button>
                        <button
                            onClick={() => handleDelete(data.id)}
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </>
    )
};