import { useState } from 'react';

export default function Async(){
    const [user, setUser] = useState(null); // 사용자 정보
    const [loading, setLoading] = useState(false); // 데이터 받아 오는 중인지 확인

    async function fetchFakeUser(){
        setLoading(true);
        setUser(null); // 이전 사용자 정보 초기화

        fakeFetchUser()
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('에러 발생', error);
                setLoading(false);
            });
    }

    return(
        <>
            <button onClick={fetchUser}>사용자 정보 가져오기</button>

            {loading && <p>로딩 중...</p>}

            {user && (
                <>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                </>
            )}
        </>
    )
}

function fakeFetchUser(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                name: '홍길동',
                email: 'hong@example.com'
            })
        }, 2000);
    })
}