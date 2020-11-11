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
	const resp = await (await (await fetch("http://fs.panictriggers.xyz:7070/api/v1/product?product=" + barcode)).json());
	if (resp.title.length === 0) {
		return null;
	}
	resp.barcode = Number(barcode);
	return resp;
};

const searchRecipe = async () => {
	const ingredients = [];
	for (let product of getCart()) {
		ingredients.push(product.subCategory);
	}
	console.log(ingredients);
	const resp = await (await (await fetch("http://fs.panictriggers.xyz:7070/api/v1/recipe/search", {
		method: 'POST',
		body: JSON.stringify({
			'ingredients': ingredients
		})
	})).json());
	console.log(resp);
}
  
(() => {
	document.getElementById("cameraInput").hidden = false;
	document.getElementById("product").hidden = true;
	document.getElementById("Automatisch").click();

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
  
document.getElementById("Handmatig").addEventListener('change', ev => {
	console.log('Handmatig!');
	document.getElementById("cameraInput").hidden = true;
	document.getElementById("product").hidden = false;
});
  
document.getElementById("Automatisch").addEventListener('change', ev => {
	console.log('Automatisch!');
	document.getElementById("cameraInput").hidden = false;
	document.getElementById("product").hidden = true;
});