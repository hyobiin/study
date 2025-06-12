import { useCallback, useEffect, useState } from "react";
// import { useImmer } from "use-immer";

const FilterEx = () => {
    const [menu, setMenu] = useState([
        { id: 0, text: '전체', visible: true},
        { id: 1, text: '기타', visible: true},
        { id: 2, text: '용도', visible: true},
        { id: 3, text: '추천', visible: false},
    ]);

    // useState 사용 시
    const handleVisible = (id) => {
        setMenu(prev =>
            prev.map(item =>
                item.id === id ? { ...item, visible: !item.visible } : item
            )
        );
    };

    // useImmer 사용 시
    // const handleVisible = (id) => {
    //     setMenu(draft => {
    //         const item = draft.find(i => i.id === id);
    //         if(item){
    //             item.visible = !item.visible;
    //         }
    //     }
    //     );
    // };

    useEffect(() => {
        console.log('useEffect 호출');
        consoleTest();
    }, []);

    const consoleTest = useCallback(() => {
        console.log('useCallback 호출');
    }, []);

    return(
        <>
            {menu
                .filter(v => v.visible === true)
                .map(data => (
                    <button
                        key={data.id}
                        style={{ margin: '0 5px' }}
                        onClick={() => {
                            handleVisible(data.id);
                        }}
                    >
                        {data.text}
                    </button>
                ))
            }
        </>
    )
}

export default FilterEx;