const getData = () => {
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
const createElement = (nodeName, attrMap) => {
    let _element = document.createElement(nodeName);
    Object.keys(attrMap).forEach(attrName => {
        _element.setAttribute(attrName, attrMap[attrName]);
    });
    return _element;
};
const productListWrapper = document.querySelector('#productListWrapper');
const generateProductCard = (productInfo) => {
    let _card = createElement('div', {
        class: 'card',
    });
    _card.innerText = productInfo.name;
    return _card;
};
const generateProductCardColumn = (card) => {
    let _cardColumn = createElement('div', { class: 'col-4' });
    _cardColumn.appendChild(card);
    return _cardColumn;
};
const populateProductList = (productList) => {
    productList.forEach(el => {
        let card = generateProductCard(el);
        let cardColumn = generateProductCardColumn(card);
        productListWrapper.appendChild(cardColumn);
    });
};
getData()
    .then((response) => {
    let productsList = JSON.parse(response.responseText);
    console.log(productsList);
    populateProductList(productsList);
})
    .catch(err => console.log('app', err));
