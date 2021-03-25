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
// 
// -----------------
// DOM Elements
// -----------------
const ProductListWrapper: HTMLDivElement = document.querySelector('#productListWrapper');
const ResultCount: HTMLSpanElement = document.querySelector('#resultCount');
const GridListToggler: HTMLSpanElement = document.querySelector('#gridListToggle');
// -----------------
// Grid/List Toggler
// -----------------
const handleGridListToggleClasses = (button: HTMLButtonElement) => {
    let _sibling = button.nextElementSibling ? button.nextElementSibling : button.previousElementSibling;
    _sibling.classList.remove('btn-info');
    _sibling.classList.add('btn-outline-info');
    button.classList.remove('btn-outline-info');
    button.classList.add('btn-info')
}

const handleGridListToggle = (e: MouseEvent) => {
    e.stopPropagation();
    let button = (<HTMLButtonElement>e.target);
    handleGridListToggleClasses(button);
    let display = button.dataset.display;
    let isGrid = !ProductListWrapper.classList.contains('product-list--list');
    if (display === 'list' && isGrid) {
        ProductListWrapper.classList.add('product-list--list');
    } else if (display === 'grid' && !isGrid) {
        ProductListWrapper.classList.remove('product-list--list');
    } else {
        return;
    }
}

const enableGirdListToggle = () => {
    GridListToggler.querySelectorAll('button').forEach(el => {
        el.hasAttribute('disabled') && el.removeAttribute('disabled');
    })
}

GridListToggler.addEventListener('click', handleGridListToggle, true);

const generateProductCard = (productInfo: any): HTMLDivElement => {
    let _card = createElement('div', {
        class: 'product-card card shadow-sm mb-4',
        title: productInfo.url
    });
    let _productName = applySentenceCase(productInfo.name);
    _card.innerHTML = `
        <div class="product-card__wishlist-button position-absolute">
            <button class="product-card__wishlist-button--button btn bg-white rounded-circle" data-id=${productInfo._id}>
                <span class="product-card__wishlist-button--icon text-danger">${ productInfo.isFav ? '&#9829;' : '&#9825;'}</span>
            </button>
        </div>
        <img src="${productInfo.picture}" class="product-card__image card-img-top" alt="${_productName}">
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
    `
    return <HTMLDivElement>_card;
}

const generateProductCardColumn = (card: HTMLDivElement): HTMLDivElement => {
    let _cardColumn = createElement('div', {class: 'product-card__wrapper col-4'});
    _cardColumn.appendChild(card);
    return <HTMLDivElement>_cardColumn;
}

const populateProductList = (productList: any[]) => {
    productList.forEach((el, i) => {
        let card = generateProductCard(el);
        let cardColumn = generateProductCardColumn(card);
        ProductListWrapper.appendChild(cardColumn);
        card.addEventListener('click', () => window.location.assign('/' + el.url));
        if (i+1 === productList.length) {
            enableGirdListToggle();
        }
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
