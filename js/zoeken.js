const getCart = () => {
	const cart = JSON.parse(localStorage.getItem('cart'));
	return cart;
}

const addToCart = (product) => {
	const cart = JSON.parse(localStorage.getItem('cart'));
	cart.push(product);
	localStorage.setItem('cart', JSON.stringify(cart));
};

const findProduct = (barcode) => {
	const cart = getCart();
	for (let product of cart) {
		if (product.barcode == barcode) {
			return product;
		}
	}
	return null;
};

const showProduct = (product) => {
	const div = document.createElement('div');
	const b = document.createElement('b');
	b.innerText = product.title;
	div.appendChild(b);
	document.getElementById("cart").appendChild(div);
}

const getProduct = async (barcode) => {
	const product = await getProductFromServer(barcode);
	if (product !== null) {
		console.log(product);
		if (findProduct(barcode) === null) {
			addToCart(product);
			showProduct(product);
		}
	}
};
  
 const getProductFromServer = async (barcode) => {
	const resp = await (await (await fetch("http://foodfinder.panictriggers.xyz:7070/api/v1/product?product=" + barcode)).json());
	if (resp.title.length === 0) {
		return null;
	}
	resp.barcode = Number(barcode);
	return resp;
};

const searchRecipe = async () => {
	const ingredients = [];
	for (let product of getCart()) {
		let x = product.subCategory.replace(/\(.*\)/, '').replace('(', '').replace(')', '');
		if (x[x.length - 1] == ' ') {
			x = x.slice(0, -1);
		}
		ingredients.push(x);
	}
	const resp = await (await (await fetch("http://foodfinder.panictriggers.xyz:7070/api/v1/recipe/search", {
		method: 'POST',
		body: JSON.stringify({
			'ingredients': ingredients
		})
	})).json());
	const recipeIDs = [];
	for (let r of resp) {
		let found = false;
		for (let id of recipeIDs) {
			if (id === r.recipeID) {
				found = true;
			}
		}
		if (!found) {
			recipeIDs.push(r.recipeID);
		}
	}

	const recipes = [];
	
	// Get the recipes from the server
	for (let rID of recipeIDs) {
		const recipe = await (await (await fetch("http://foodfinder.panictriggers.xyz:7070/api/v1/recipe?recipe=" + rID)).json());
		recipes.push(recipe);
	}

	const div = document.createElement("div");
	for (let recipe of recipes) {
		const d = document.createElement("div")
		const a = document.createElement("a");
		a.href = recipe.url;
		a.innerText = `${recipe.name}`;
		console.log(a);
		d.appendChild(a);
		d.setAttribute("id", "thisIsARecipe");
		d.setAttribute("class", "thisIsARecipeHisClass");
		d.setAttribute("style", "background-image: url(" + recipe.imageURL + "); outline: 6px inset #373a40; outline-offset: 0px;");

		const p = document.createElement('p');
		d.addEventListener("click", () => {
			window.open(recipe.url, "_blank");
		});

		for (let ingredient of recipe.ingredients) {
			let pIngredient = document.createElement('p');
			pIngredient.innerText = ingredient;
			p.appendChild(pIngredient);
		}
		d.appendChild(p);
		div.appendChild(d);
	}

	document.getElementById("cart").hidden = true;
	document.getElementById("recipes").appendChild(div);
}
  
(() => {
	if (getCart() === null) {
		localStorage.setItem('cart', JSON.stringify([]));
	} else {
		const cart = getCart();
		for (let product of cart) {
			console.log(product);
			showProduct(product);
		}
	}
 })();
  
const clearCart = () => {
	localStorage.setItem('cart', JSON.stringify([]));
	document.getElementById("cart").innerHTML = '';
}