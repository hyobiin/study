const recipes = [
    {
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
    }
];

function Recipe({ id, name, ingredients}){ // 객체 구조 분해
    return(
        <div key={id}>
            <h2>{name}</h2>
            <ul>
                {ingredients.map(ingredient =>
                <li key={ingredient}>
                    {ingredient}
                </li>
                )}
            </ul>
        </div>
    )
}

export default function RecipeList() {
    return (
        <div>
            <h1>Recipes</h1>
            {recipes.map(recipe =>
                <Recipe {...recipe} key={recipe.id} />
            )}
        </div>
    );
}
