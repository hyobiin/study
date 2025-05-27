const recipes = [{
    id: 'greek-salad',
    name: 'Greek Salad',
    ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
    id: 'hawaiian-pizza',
    name: 'Hawaiian Pizza',
    ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
    id: 'hummus',
    name: 'Hummus',
    ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];

export default function RecipeList() {
    return (
        <div>
            <h1>Recipes</h1>

            {recipes.map((data) => (
                <div key={data.id}>
                    <h2>{data.name}</h2>
                    <ul>
                        {data.ingredients.map((data, idx) => (
                            <li key={idx}>{data}</li>
                        ))
                        }
                    </ul>
                </div>
            ))}
        </div>
    );
}