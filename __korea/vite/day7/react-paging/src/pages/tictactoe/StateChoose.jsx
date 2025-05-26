import { useState } from 'react';

/* NOTE_HB
    컴포넌트 함수 바깥에 있는 이유
    => 안에 있으면 컴포넌트가 렌더링될 때마다 초기화되기 때문, 현재 위치에 있으면 한 번만 생성
*/
const initialItems = [
    { title: 'pretzels', id: 0 },
    { title: 'crispy seaweed', id: 1 },
    { title: 'granola bar', id: 2 },
];

export default function StateChoose(){
    const [items, setItems] = useState(initialItems);
    const [selectedId, setSelectedId] = useState(0);

    // 선택된 아이템 찾기, 없으면 null 처리
    const selectedItem = items.find(item => item.id === selectedId) || null;

    // id로 항목 변경 이벤트 함수 생성 (커링 기법)
    function handleChange(id) {
        return (e) => {
            const newTitle = e.target.value;
            setItems(items.map(item =>
                item.id === id ? { ...item, title: newTitle } : item
            ));
        };
    }

    return (
        <>
        <h2>What's your travel snack?</h2>
        <ul>
            {items.map(item => (
                <li key={item.id}>
                    <input
                        value={item.title}
                        onChange={handleChange(item.id)}
                    />{' '}
                    <button onClick={() => setSelectedId(item.id)}>
                        Choose
                    </button>
                </li>
            ))}
        </ul>
        <p>
            {selectedItem ? `You picked ${selectedItem.title}.` : 'Please pick a snack.'}
        </p>
        </>
    );
}