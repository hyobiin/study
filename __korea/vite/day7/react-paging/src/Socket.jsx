import React, { useEffect, useRef, useState } from "react";

export default function WebSocketEchoTest() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {
        // 무료 WebSocket 에코 서버 연결
        socketRef.current = new WebSocket("wss://echo.websocket.events/");

        socketRef.current.onopen = () => console.log("웹소켓 연결 성공!");
        socketRef.current.onmessage = (event) => {
        setMessages((prev) => [...prev, event.data]);
        };
        socketRef.current.onclose = () => console.log("웹소켓 연결 종료");
        socketRef.current.onerror = (error) => console.log("웹소켓 에러:", error);

        // 컴포넌트 언마운트 시 연결 종료
        return () => socketRef.current.close();
    }, []);

    const sendMessage = () => {
        if (!input) return;
        socketRef.current.send(input); // 메시지 보내기
        setInput("");
    };

    return (
        <div style={{ padding: "16px" }}>
        <h1>WebSocket 에코 테스트</h1>
        <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지 입력"
        />
        <button onClick={sendMessage}>보내기</button>

        <h2>받은 메시지</h2>
        <ul>
            {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
            ))}
        </ul>
        </div>
    );
}