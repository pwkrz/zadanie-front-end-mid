const GetData = () => {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.onload = () => {
            resolve(request);
        };
        request.onerror = err => {
            reject(err);
        };
        request.open("get", "/data/products.json", true);
        request.send();
    });
};
const ProductListWrapper = document.querySelector('#productListWrapper');
const createProductCards = (productList) => {
    productList.forEach(el => {
        let card = document.createElement('div');
        card.classList.add('card', 'col-4');
        card.innerText = el.name;
        ProductListWrapper.appendChild(card);
    });
};
GetData()
    .then((response) => {
    let productsList = JSON.parse(response.responseText);
    console.log(productsList);
    createProductCards(productsList);
})
    .catch(err => console.log('app', err));
