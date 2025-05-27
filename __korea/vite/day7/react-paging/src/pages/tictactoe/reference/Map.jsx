function getImageUrl(imageId, size = 's') {
    return (
        'https://i.imgur.com/' +
        imageId +
        size +
        '.jpg'
    );
}

const person = [
    {
        id:0,
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        awardsNumber: 2,
        awards: '(Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)',
        discovered: 'polonium (chemical element)',
        url: 'szV5sdG'
    },
    {
        id:1,
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        awardsNumber: 4,
        awards: '(Miyake Prize for geochemistry, Tanaka Prize)',
        discovered: 'a method for measuring carbon dioxide in seawater',
        url: 'YfeOqp2'
    }
]

function PersonList({ person }){
    return(
        <section className="profile">
        <h2>{person.name}</h2>
        <img
            className="avatar"
            src={getImageUrl(person.url)}
            alt={person.name}
            width={70}
            height={70}
        />
        <ul>
            <li>
            <b>Profession: </b>
            {person.profession}
            </li>
            <li>
            <b>Awards: {person.awardsNumber} </b>
            {person.awards}
            </li>
            <li>
            <b>Discovered: </b>
            {person.discovered}
            </li>
        </ul>
        </section>
    )
}

export default function Gallery() {
    return (
        <div>
        <h1>Notable Scientists</h1>
        {person.map((person) => (
            <PersonList key={person.id} person={person}/>
        ))}
        </div>
    );
}