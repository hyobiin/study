import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        try {
            const res = await axios.get('http://localhost:3200/users', {
                params: {
                    username: form.username,
                    password: form.password
                }
            });

            if (res.data.length > 0) {
                console.log('로그인 성공');
                setLoginSuccess(true);
                // ex: localStorage.setItem("user", JSON.stringify(res.data[0]));
            } else {
                alert('아이디 또는 비밀번호가 잘못되었습니다.');
            }
        } catch (error) {
        console.error('로그인 실패:', error);
        }
    };

    return (
        <div>
            <h2>로그인</h2>
            <input name="username" onChange={handleChange} placeholder="아이디" />
            <input name="password" type="password" onChange={handleChange} placeholder="비밀번호" />
            <button onClick={handleLogin}>로그인</button>
            {loginSuccess && <p>로그인 성공!</p>}
        </div>
    );
};

export default Login;