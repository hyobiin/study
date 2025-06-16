import { createContext, useContext, useState } from "react";

// 1. Context 생성
const ThemeContext = createContext();

const Child = () => {
    // 2. 자식 컴포넌트
    const { theme, toggleTheme } = useContext(ThemeContext);
    return(
        <>
            <p>현재 테마 {theme}</p>
            <button onClick={toggleTheme}>테마 전환</button>
        </>
    )
};

// 3. Provider 생성
const UseContextEx = () => {
    const [theme, setTheme]= useState('light');
    const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

    return(
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div
                style={{
                    background: theme === 'light' ? '#fff' : '#333',
                    color: theme === 'light' ? '#000' : '#fff',
                    padding: 20,
                }}
            >
                <h1>useContext 사용</h1>
                <Child />
            </div>
        </ThemeContext.Provider>
    )
};

export { Child, UseContextEx };