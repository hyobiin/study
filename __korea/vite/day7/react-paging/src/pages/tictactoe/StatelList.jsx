import { useState } from 'react';

let nextId = 3;
const initialItems = [
    { id: 0, title: 'Warm socks', packed: true },
    { id: 1, title: 'Travel journal', packed: false },
    { id: 2, title: 'Watercolors', packed: false },
];

function PackingList({
    items,
    onChangeItem,
    onDeleteItem
}) {
    return (
        <ul>
            {items.map(item => (
                <li key={item.id}>
                <label>
                    <input
                    type="checkbox"
                    checked={item.packed}
                    onChange={e => {
                        onChangeItem({
                            ...item,
                            packed: e.target.checked
                        });
                    }}
                    />
                    {' '}
                    {item.title}
                </label>
                <button onClick={() => onDeleteItem(item.id)}>
                    Delete
                </button>
                </li>
            ))}
        </ul>
    );
}

function AddItem({ onAddItem }) {
    const [title, setTitle] = useState('');
    return (
        <>
        <input
            placeholder="Add item"
            value={title}
            onChange={e => setTitle(e.target.value)}
        />
        <button onClick={() => {
            setTitle('');
            onAddItem(title);
        }}>Add</button>
        </>
    )
}

export default function StateList() {
    const [items, setItems] = useState(initialItems);
    const total = items.length;
    const packed = items.filter(item => item.packed).length;

    function handleAddItem(title) {
        setItems([
            ...items,
            {
                id: nextId++,
                title: title,
                packed: false
            }
        ]);
    }

    function handleChangeItem(nextItem) {
        setItems(items.map(item => {
            if (item.id === nextItem.id) {
                return nextItem;
            } else {
                return item;
            }
        }));
    }

    function handleDeleteItem(itemId) {
        setItems(
            items.filter(item => item.id !== itemId)
        );
    }

    return (
        <>
        <AddItem
            onAddItem={handleAddItem}
        />
        <PackingList
            items={items}
            onChangeItem={handleChangeItem}
            onDeleteItem={handleDeleteItem}
        />
        <hr />
        <b>{packed} out of {total} packed!</b>
        </>
    );
}
