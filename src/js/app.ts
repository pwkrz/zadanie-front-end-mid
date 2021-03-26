//------------------
// UTILS
// -----------------
const convertPriceToNumber = (price: string) => Number(price.slice(1));

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
// Elements
// -----------------
const ProductListWrapper: HTMLDivElement = document.querySelector('#productListWrapper');
const ResultCount: HTMLSpanElement = document.querySelector('#resultCount');
const GridListToggler: HTMLDivElement = document.querySelector('#gridListToggle');
// Podejście klasowe
let productListSorter;
// -----------------
// 
// -----------------
// Data
// -----------------
interface Product {
    url: string
    rating: number,
    name: string
    size: string
    picture: string
    savings: string
    oldPrice: string
    price: string
    isFav: boolean,
    _id: string
}
let productsList: Product[];
// -----------------
//
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
// -----------------
//
// -----------------
// Product List/Grid
// -----------------
const generateProductCard = (productInfo: any): HTMLDivElement => {
    let _card = createElement('div', {
        class: 'product-card card shadow-sm mb-4',
        title: window.location + productInfo.url
    });
    let _productName = applySentenceCase(productInfo.name);
    _card.innerHTML = `
        <div class="product-card__wishlist-button position-absolute">
            <button class="product-card__wishlist-button--button btn bg-white rounded-circle" data-id=${productInfo._id}>
                <span class="product-card__wishlist-button--icon text-danger">${ productInfo.isFav ? '&#9829;' : '&#9825;'}</span>
            </button>
        </div>
        <img src="${productInfo.picture}" class="product-card__image card-img-top" alt="${_productName}">
        <div class="product-card__info card-body">
            <h5 class="card-title text-secondary mb-0">${_productName}</h5>
            <p class="mb-2">
                <small class="product-card__info__product-size card-text">${productInfo.size}
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
    let _cardColumn = createElement('div', {class: 'product-card__wrapper col-lg-4 col-md-6 col-sm-12'});
    _cardColumn.appendChild(card);
    return <HTMLDivElement>_cardColumn;
}

const populateProductList = (productList: any[]) => {
    ProductListWrapper.innerHTML = '';
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
// -----------------
//
// -----------------
// Product List Controls
// -----------------
const populateResultCount = (count: number) => {
    ResultCount.innerText = count.toString();
}

// Podejście klasowe
class ProductListSorter {
    nativeElement: HTMLSelectElement;
    constructor(natEl: HTMLSelectElement) {
        this.nativeElement = natEl;
        this.nativeElement.addEventListener('change', (e: any) => this.handleChange(e))
    }
    handleChange(e: any) {
        switch (e.target.value) {
            case 'price-inc':
                productsList.sort((a,b) => convertPriceToNumber(a.price) - convertPriceToNumber(b.price));
                break;
            case 'price-dec':
                productsList.sort((a,b) => convertPriceToNumber(b.price) - convertPriceToNumber(a.price));
                break;
            case 'name-inc':
                productsList.sort((a,b) => a.name.localeCompare(b.name));
                break;
            case 'name-dec':
                productsList.sort((a,b) => b.name.localeCompare(a.name));
                break;
        }
        populateProductList(productsList);
    }

}

getData()
    .then((response: any) => {
        productsList = JSON.parse(response.responseText);
        populateProductList(productsList);
        populateResultCount(productsList.length)
        productListSorter = new ProductListSorter(document.querySelector('#productListSorter'));
    })
    .catch(err => console.log('app', err))
