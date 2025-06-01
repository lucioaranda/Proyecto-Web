const products = [{
    name:"Camiseta",
    description: "Camiseta de algodon 100%",
    image: "#img",
    price: 15
},
{
    name:"Pantalones",
    description: "Pantalones de mezclilla",
    image: "#img",
    price: 25
},
{
    name:"Camiseta",
    description: "Camiseta de algodon 100%",
    image: "#img",
    price: 15
},
{
    name:"Camiseta",
    description: "Camiseta de algodon 100%",
    image: "#img",
    price: 15
}
];

const grid = document.querySelector('.product-grid');
const searchInput = document.querySelector('#input-search-products')

function createProductCard(product){
    const card = document.createElement('article');
    card.classList.add('product-card');
    
    const img =document.createElement('img');
    img.src = product.image;
    img.alt = product.name;

    const title = document.createElement('h3');
    title.textContent = product.name;

    const description = document.createElement('p');
    description.textContent = product.description;

    const price = document.createElement('p');
    price.textContent = `$${product.price}`;

    const button = document.createElement('button');
    button.textContent = 'Comprar';

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(price);
    card.appendChild(button);

    return card
}
function renderProducts(list){
products.forEach(product => {
    const card = createProductCard(product);
    grid.appendChild(card)
});
}
function filterProducts(text){
    const filteredProducts = products.filter(product => {
        return product.name.toLocaleLowerCase().includes(text.toLocaleLowerCase());
    })
    grid.innerHTML='';
    renderProducts(filteredProducts);
}
searchInput.addEventListener('input', (e) =>{
    filterProducts(e.target.value);
});
const button = document.querySelector('btn-add-products')
button.addEventListener('click',addProduct) // Agrega cartas de productos dinaicamente//