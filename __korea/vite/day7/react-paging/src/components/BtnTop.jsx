import { useState, useEffect } from "react";

const BtnTop = () => {
    const [visible, setVisible] = useState(false);

    const handleScroll = () => {
        setVisible(window.scrollY > 100);
    };

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return(
        <button
            className={`btn_top ${visible ? 'visible' : ''}`}
            onClick={scrollTop}
        >TOP</button>
    )
}

export default BtnTop;