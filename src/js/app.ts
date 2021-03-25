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
// -----------------
const ProductListWrapper: HTMLDivElement = document.querySelector('#productListWrapper');
const ResultCount: HTMLSpanElement = document.querySelector('#resultCount');

const generateProductCard = (productInfo: any): HTMLDivElement => {
    let _card = createElement('div', {
        class: 'card mb-4',
    });
    _card.innerText = productInfo.name;
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
