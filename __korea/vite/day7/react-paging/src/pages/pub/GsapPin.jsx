import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react"

const PinnedEx = () => {
    gsap.registerPlugin(ScrollTrigger);
    const sectionRef = useRef(null);

    useEffect(() => {
        const el = sectionRef.current;

        gsap.to(el, {
            background: '#000',
            color: '#fff',
            duration: 1,
            scrollTrigger: {
                trigger: el,
                start: 'top top',
                end: '+=300',
                pin: true,
                scrub: true,
                markers: true,
            }
        });
    }, []);

    return(
        <section
            ref={sectionRef}
            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: "bold",
                backgroundColor: "#f0f0f0",
                color: "#222",
            }}
        >
            스크롤시 고정 되고 색 변경
        </section>
    )
}

export default PinnedEx;