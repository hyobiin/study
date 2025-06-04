const poem = {
    lines: [
        'I write, erase, rewrite',
        'Erase again, and then',
        'A poppy blooms.'
    ]
};

export default function Poem(){
    return(
        <>
            {poem.lines.map((line, i) => (
                <div key={`${i} -${line}`}>
                    <p>{line}</p>
                    {i !== poem?.lines.length - 1 && <hr />}
                </div>
            ))}
        </>
    )
}