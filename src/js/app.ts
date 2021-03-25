//------------------
// UTILS
// -----------------
interface ElementData {

}
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
    })
}
const createElement = (nodeName: string, attrMap: {[attrName: string]: string}): HTMLElement => {
    let _element = document.createElement(nodeName);
    Object.keys(attrMap).forEach(attrName => {
        _element.setAttribute(attrName, attrMap[attrName]);
    });
    return _element;
}
const applySentenceCase = (string: string) => (string[0].toUpperCase() + string.slice(1));
// -----------------
const ProductListWrapper: HTMLDivElement = document.querySelector('#productListWrapper');
const ResultCount: HTMLSpanElement = document.querySelector('#resultCount');

const generateProductCard = (productInfo: any): HTMLDivElement => {
    let _card = createElement('div', {
        class: 'card mb-4',
    });
    let _productName = applySentenceCase(productInfo.name);
    _card.innerHTML = `
        <img src="${productInfo.picture}" class="card-img-top" alt="${_productName}">
        <div class="card-body">
            <h5 class="card-title text-secondary mb-0">${_productName}</h5>
            <p class="mb-2">
                <small class="card-text">${productInfo.size}
                    <span class="rating text-danger">${'&#9733;'.repeat(productInfo.rating)}</span>
                </small>
            </p>
            <div class="d-flex align-items-baseline">
                <h3 class="float-left mr-2">${productInfo.price}</h3>
                <small class="text-muted font-weight-light mr-2"><s>${productInfo.oldPrice ? productInfo.oldPrice : ''}</s></small>
                <small class="text-danger font-weight-light">${productInfo.oldPrice ? ('You save ' + productInfo.savings) : ''}</small>
            </div>
        </div>
        <div class="position-absolute"><span class="text-danger">${ productInfo.isFav ? '&#9829;' : '&#9825;'}</span></div>
    `
    return <HTMLDivElement>_card;
}

const generateProductCardColumn = (card: HTMLDivElement): HTMLDivElement => {
    let _cardColumn = createElement('div', {class: 'col-4'});
    _cardColumn.appendChild(card);
    return <HTMLDivElement>_cardColumn;
}

const populateProductList = (productList: any[]) => {
    productList.forEach(el => {
        let card = generateProductCard(el);
        let cardColumn = generateProductCardColumn(card);
        ProductListWrapper.appendChild(cardColumn);
    })
}

const populateResultCount = (count: number) => {
    ResultCount.innerText = count.toString();
}

getData()
    .then((response: any) => {
        let productsList = JSON.parse(response.responseText);
        console.log(productsList);
        populateProductList(productsList);
        populateResultCount(productsList.length)
    })
    .catch(err => console.log('app', err))
