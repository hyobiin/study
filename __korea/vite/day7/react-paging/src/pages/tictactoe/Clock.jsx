import { useEffect, useState } from 'react';

export default function Clock(props) {
    const [color, setColor] = useState('');

    return (
        <>
        <label>컬러 선택</label>
        <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
        >
            <option value="" hidden>선택해주세요</option>
            <option value="red">빨강</option>
            <option value="green">초록</option>
            <option value="blue">파랑</option>
            <option value="black">검정</option>
            <option value="orange">주황</option>
        </select>

        <h1 style={{ color: color }}>
            {props.time}
        </h1>
        </>
    );
}
