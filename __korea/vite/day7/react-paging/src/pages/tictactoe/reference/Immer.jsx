import { useState } from 'react';
import { useImmer } from 'use-immer';


/*
    // useImmer와 useState의 공통점
        - 상태 관리 훅
        - 불변성 유지
    // useImmer와 useState의 차이
        ** useImmer => 직접 수정하듯 작성 가능 (직접 상태를 변경하는 것 처럼 보이지만, 안보이는 내부적으로는 복사본을 만들어서 수정하고 새 상태로 자동으로 변경해줌)
        ** useState => 직접 복사해서 수정한 새 객체 반환 (복사할수록 중첩, ...prev 같은 형태)
*/

export default function ImmerUse(){
    const [state, setState] = useImmer({ count: 0 });
    const [state2, setState2] = useState({ count: 0 });

    return(
        <>
            <div>{state.count}</div>
            <button onClick={() => setState(prev => { prev.count += 1})}> +1 </button>

            <div>{state2.count}</div>
            <button
                onClick={() =>
                    setState2(prev => ({
                        ...prev, // {count: 0}이 아니고 그냥 (0)이었으면 필요없음
                        count: prev.count + 1
                    }))
                }
            >
            +1
            </button>
        </>
    )
}