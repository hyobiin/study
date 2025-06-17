import { useEffect } from "react";
import { useImmer } from "use-immer";

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
    const [sortOrder, setSortOrder] = useImmer('desc'); // desc 최신순, asc 오래된순

    const completedTodos = filteredTodos.filter(todo => todo.completed); // 완료 목록
    const uncompletedTodos = filteredTodos.filter(todo => !todo.completed); // 미완료 목록

    function handleAdd(text){
        const lastId = todos.length > 0
            ? Math.max(...todos.map(todo => todo.id))
            : 0;

        setTodos(draft => {
            draft.push({
                id: lastId + 1,
                text,
                completed: false,
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
        // 전체보기를 눌러도 정렬 부분 동기화
        const sorted = [...todos].sort((a, b) =>
            sortOrder === 'desc' ? b.id - a.id : a.id - b.id
        );
        setFilteredTodos(sorted);
    }

    // 정렬
    function handleSortToggle(){
        setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));

        setFilteredTodos(draft =>
            [...draft].sort((a, b) =>
                sortOrder === 'desc'
                    ? a.id - b.id  // 최신순
                    : b.id - a.id
            )
        )
    }

    useEffect(() => {
        handleShowAll();
    }, [todos]);

    useEffect(() => {
        if(searchText.trim() === ''){
            handleShowAll();
        }
    }, [searchText]);

    // 로컬스토리지에서 불러오기
    useEffect(() => {
        const storedTodos = localStorage.getItem('todos');
        if(storedTodos){
            setTodos(JSON.parse(storedTodos));
        }
    }, []);

    // 로컬스토리지에 저장
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    // 정렬 버그 해결 (새로 추가하면 정렬이 한 번에 안 되는 문제)
    useEffect(() => {
        const sorted = [...todos].sort((a, b) =>
            sortOrder === 'desc' ? b.id - a.id : a.id - b.id
        );
        setFilteredTodos(sorted);
    }, [todos, sortOrder]);

    return(
        <>
            <h2>
                Todo List ||
                <span> 총 {todos.length}개</span>
                <span> | 완료 {todos.filter(todo => todo.completed).length}개</span>
            </h2>
            <button onClick={handleShowAll}>__전체 보기</button>
            <button onClick={handleSortToggle}>{ sortOrder === 'desc' ? '최신순' : '오래된 순'}</button>
            <hr />

            {/* 서치 */}
            <div className="inp_box">
                <input
                    type="text"
                    placeholder="검색어 입력"
                    className="inp"
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
            <hr />

            {/* 추가 */}
            <div className="inp_box">
                <input
                    type="text"
                    placeholder="할 일 입력"
                    className="inp"
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
            <div className="todo_list">
                {/* 미완료 */}
                <div>
                    <span>미완료</span>
                    <ul>
                        {uncompletedTodos.length === 0
                            ? (
                                <li>미완료된 할 일이 없습니다.</li>
                            ) : (
                                uncompletedTodos.map(data => (
                                    <li
                                        key={data.id}
                                    >
                                        {editingId === data.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    id={`inpEdit-${data.id}`}
                                                    value={editText}
                                                    className="inp"
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if(e.key === 'Enter'){
                                                            handleEdit({ ...data, text: editText });
                                                            setEditingId(null);
                                                        }
                                                    }}
                                                    // onBlur={() => {
                                                    //     handleEdit({ ...data, text: editText });
                                                    //     setEditingId(null);
                                                    // }}
                                                    autoFocus
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
                                            <>
                                                <span>{data.text}</span>
                                                <button
                                                    onClick={() => {
                                                        setEditingId(data.id);
                                                        setEditText(data.text);
                                                    }}
                                                >수정</button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleCheck(data.id)}
                                            style={{
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
                                ))
                            )}
                    </ul>
                </div>

                {/* 완료 */}
                <div>
                    <span>완료</span>
                    <ul>
                        {completedTodos.length === 0 ? (
                            <li>완료된 할 일이 없습니다.</li>
                            ) : (
                                completedTodos.map(data => (
                                    <li
                                        key={data.id}
                                        style={{ textDecoration: 'line-through' }}
                                    >
                                        <span>{data.text}</span>
                                        <button
                                            onClick={() => handleCheck(data.id)}
                                            style={{
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
                                ))
                            )
                        }
                    </ul>
                </div>
            </div>
        </>
    )
};