//Selectors
const deleteIngredientButton = document.querySelectorAll(".delete-item-button")

//Event listeners
window.addEventListener('load', () => {

    deleteIngredientButton.forEach(btn =>
        btn.addEventListener("click", e => {
            const ingredientContainer = btn.closest(".list-ingredient-container")
            const ingredientName = ingredientContainer.children[1].innerHTML
            RecipeAPIHandler.deleteIngredientFromShoppingList(ingredientName)
                .then(() => ingredientContainer.remove())
                .catch(err => {
                    throw new Error(err)
                })
        })
    )

})