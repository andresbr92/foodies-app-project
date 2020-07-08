class RecipeApiHandler {
    constructor() {
        this.axiosAPI = axios.create({
            baseURL: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            headers: {
                "x-rapidapi-key": "9bb56c9bc8msh80f4ea557c0f1a9p1a2052jsna9286dfaab2b"
            }
        })
        this.axiosServer = axios.create({
            baseURL: "http://localhost:5010/"
        })
    }
    getFullList(query) {
        return this.axiosAPI.get(`/recipes/complexSearch?query=${query}`)
            .then(response => response.data.results.map(data => data.id))
            .catch(err => {
                throw new Error(err)
            })
    }
    getRecipeInformationById(id) {
        return this.axiosAPI.get(`recipes/${id}/information?includeNutrition=true`)
            .then(response => response.data)
            .catch(err => {
                throw new Error(err)
            })
    }
    addToFavourites(recipeInfo, recipeId) {
        return this.axiosServer.post(`/recipes/add-to-favourites/${recipeId}`, recipeInfo)
            .then(response => response.data)
            .catch(err => {
                throw new Error(err)
            })
    }
    deleteRecipe(recipeId) {
        return this.axiosServer.post(`/profile/my-recipes/delete/${recipeId}`)
            .then(response => response.data)
            .catch(err => {
                throw new Error(err)
            })
    }
    addRecipeToWeek(recipeId, mealDate) {
        console.log("AQUIII")
        return this.axiosServer.post(`/profile/my-recipes/add-to-week/${recipeId}`, {
                mealDate
            })
            .then(response => {
                console.log(response)
                "Created"
            })
            .catch(err => {
                throw new Error(err)
            })
    }


}
const RecipeAPIHandler = new RecipeApiHandler()