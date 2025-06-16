import { useRef, useState, useEffect } from "react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const GsapEx = () => {
    gsap.registerPlugin(ScrollTrigger);
    const boxRef = useRef(null);
    const boxRef2 = useRef(null);
    const boxRef3 = useRef(null);
    const [ani, setAni] = useState(true);

    const handleAni = () => {
        gsap.to(boxRef.current, {
            x: 200, duration: 1
        });
    };

    const handleAniBack = () => {
        gsap.to(boxRef.current,{
            x:0, duration: 1
        });
    }

    useEffect(() => {
        gsap.to(boxRef2.current, {
            scrollTrigger: {
                trigger: boxRef2.current,
                start: 'top 80%',
                end: 'top 30%',
                scrub: true,
                toggleActions: 'play none none reverse'
            },
            x: 150,
            opacity: 1,
            duration: 1,
        });

        gsap.to(boxRef3.current, {
            scrollTrigger: {
                trigger: boxRef3.current,
                start: 'top 80%',
                end: 'top 30%',
                scrub: true,
                toggleActions: 'play none none reverse'
            },
            x: -150,
            opacity: 1,
            duration: 1,
        });
    }, []);

    return(
        <>
            <button onClick={() => {
                {ani ? handleAni() : handleAniBack()}
                setAni(!ani);
            }}>{ani ? '애니메이션 시작' : '애니메이션 복귀'}</button>
            <div
                ref={boxRef}
                style={{
                    width:100,
                    height:100,
                    marginTop:'10px',
                    backgroundColor:'tomato',
                }}
            >
                애니메이션 박스
            </div>
            <div
                ref={boxRef2}
                style={{
                    width:100,
                    height:100,
                    margin:'10px auto 0',
                    border:'2px solid #aaa'
                }}
            >
                scrollTrigger 박스
            </div>
            <div
                ref={boxRef3}
                style={{
                    width:100,
                    height:100,
                    margin:'10px auto 0',
                    border:'2px solid #000'
                }}
            >
                scrollTrigger 박스2
            </div>
        </>
    )
}

export default GsapEx;