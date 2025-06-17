import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react"

const PinnedExSeveral = () => {
    gsap.registerPlugin(ScrollTrigger);
    const sectionRefs = useRef([]);

    useEffect(() => {
        const commonScrollOpt = {
            start: 'top top',
            end: '+=300',
            pin: true,
            scrub: true,
            markers: true,
        };

        sectionRefs.current.forEach((el, index) => {
            if (!el) return;

            const trigger = { ...commonScrollOpt, trigger: el};

            if(index === 0){
                gsap.to(el, {
                    backgroundColor: '#111',
                    color: '#fff',
                    scrollTrigger: trigger,
                    duration: 1,
                });
            }else if(index === 1){
                gsap.to(el, {
                    x: 100,
                    repeat: 1,
                    yoyo: true,
                    scrollTrigger: trigger
                })
            }else{
                gsap.fromTo(el,
                    {y: 100, opacity: 0},
                    {
                        y: 0,
                        opacity: 1,
                        scrollTrigger: trigger
                    }
                )
            }
        });
    }, []);

    return(
        <div>
            {[0, 1, 2].map((_, i) => (
                <section
                    key={i}
                    ref={(el) => (sectionRefs.current[i] = el)}
                    style={{
                        height: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        backgroundColor: '#f0f0f0',
                        color: '#222'
                    }}
                >
                    섹션 {i+1}
                </section>
            ))}
        </div>
    );
};

export default PinnedExSeveral;