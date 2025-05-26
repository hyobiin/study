import { useState } from "react";

export default function Form(){
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('typing');

    if(status === 'success'){
        return <p>맞습니다.</p>
    }

    async function handleSubmit(e){
        e.preventDefault(); // 새로고침 방지
        setStatus('submitting');
        try{
            await submitForm(answer);
            setStatus('success');
        }catch(err){
            setStatus('typing');
            setError(err);
        }
    }

    function handleTextareaChange(e){
        setAnswer(e.target.value);
    }

    // 페이지
    return(
        <>
            <p>퀴즈</p>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={answer}
                    onChange={handleTextareaChange}
                    disabled={status === 'submitting'}
                    placeholder='답을 입력하세요'
                /><br />
                <button
                    type="submit"
                    disabled={answer.length === 0 || status === 'submitting'}
                >
                    제출
                </button>
                {error !== null && <p style={{color: 'red'}}>오류가 발생했습니다: {error.message}</p>}
            </form>
        </>
    )
}

function submitForm(answer) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let shouldError = answer.toLowerCase() !== 'lima'
            if (shouldError) {
                reject(new Error('다시 입력하세요.'));
            } else {
                resolve();
            }
        }, 1500);
    });
}