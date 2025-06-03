/* const API_TOKEN = 'pathdvs7fO8A5c7ub.2d90db5930290ea0d20c24839ada2d49978c76a9416c214176354d34c1e80783';
const BASE_ID = 'appHDoJ0skWqgb4jE';
const TABLE_NAME = 'Products';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const products = [];
const cartProducts = JSON.parse(localStorage.getItem('cart')) || [];

const addToAirtable = async (product)=>{
    
    const itemAirtable = {
        fields: product
    };

    fetch(API_URL, {
        method: 'POST',
        headers:{
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemAirtable)
    }).then(data => console.log(data));
}

const getProducts = async () => {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers:{
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log('data', data);

    const productsMaped = data.records.map(item => {
        return {
            title: item.fields.title,
            description: item.fields.description,
            thumbnail: item.fields.thumbnail,
            price: item.fields.price
        };
    })
    console.log(productsMaped);

    renderProducts(productsMaped);
}

getProducts();

const grid = document.querySelector('.product-grid');
const searchInput = document.querySelector('#input-search-products');
const deliveryFreeCheckBox = document.querySelector('#delivery-free');


function createProductCard(product) {
    const card = document.createElement('article');
    card.classList.add('product-card');

    const img = document.createElement('img');
    img.src = product.thumbnail;
    img.alt = product.title;

    const title = document.createElement('h3');
    title.textContent = product.title;

    const description = document.createElement('p');
    description.textContent = product.description;

    const price = document.createElement('p');
    price.textContent = `$${product.price}`;

    const button = document.createElement('button');
    button.textContent = 'Agregar al carrito';
    button.addEventListener('click', () => {
        const exists = cartProducts.find(p => p.title === product.title);
        if (!exists){
            cartProducts.push(product);
            localStorage.setItem('cart', JSON.stringify(cartProducts));
            console.log('Producto agregado al carrito');
        }
    });

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(price);
    card.appendChild(button);

    return card;
}

function addProduct() {
    // esto esta hardocodeado, hacer formulario de alta
    const newProduct = {
        title: "Form Producto",
        description: "Descripción del nuevo producto",
        thumbnail: "./img/image-google.png",
        price: 20
    };

    // Insertarlo en airtable
    addToAirtable(newProduct);

    const card = createProductCard(newProduct);
    grid.appendChild(card);
}

function renderProducts(list){
    list.forEach( product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

function filterProducts(text){
    const filteredProducts = products.filter( product => {
        return product.name.toLowerCase().includes(text.toLowerCase())
        && (product.deliveryFree === deliveryFreeCheckBox.checked || !deliveryFreeCheckBox.checked);
    });
    grid.innerHTML = '';
    renderProducts(filteredProducts);
}

searchInput.addEventListener('input', (e) => {
    filterProducts(e.target.value);
});

deliveryFreeCheckBox.addEventListener('change', (e) => {
    filterProducts(searchInput.value);
})

renderProducts(products);

const button = document.querySelector('#btn-add-products');

button.addEventListener('click', addProduct);


const numbers = [1, 2, 3, 4, 5];
// map examples
/*
const squaredNumbers = numbers.map(p => p * p);
console.log('numeros', numbers);
console.log('numeros al cuadrado', squaredNumbers);
*/

// reduce examples
/*
const sum = numbers.reduce((accumulator, p) => {
    return accumulator + p;
},0);

console.log('original', numbers);
console.log('suma', sum);
*/

// find examples
const foundProduct = products.find(p => p.name.includes('a'));
const filteredProducts = products.filter(p => p.name.includes('a'));
console.log('producto encontrado', foundProduct);
console.log('productos filtrados', filteredProducts);
