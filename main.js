"use strict";
//https://www.smashingmagazine.com/2010/10/local-storage-and-how-to-use-it/
//JSON.parse(localStorage.getItem("cart")) is used to convert JSON to array from Local storage
let cart = JSON.parse(localStorage.getItem("cart")) || []; //cannot be parsed if cart is empty(value of array is null)
//https://gomakethings.com/javascript-selectors-in-html/
const cartDOM = document.querySelector(".cart");
const addToCartButtonsDOM = document.querySelectorAll(
  '[data-action="ADD_TO_CART"]'
);

if (cart.length > 0) {
  cart.forEach(cartItem => {
    const product = cartItem;
    insertItemToDOM(product); //refactoring
    countCartTotal(); //call countCartTotal() when inserting new item into the DOM also time cart is saved into local storage.
    addToCartButtonsDOM.forEach(addToCartButtonDOM => {
      const productDOM = addToCartButtonDOM.parentNode;

      if (
        productDOM.querySelector(".product__name").innerText === product.name
      ) {
        handleActionButtons(addToCartButtonDOM, product); //refactoring
      }
    });
  });
}

addToCartButtonsDOM.forEach(addToCartButtonDOM => {
  addToCartButtonDOM.addEventListener("click", () => {
    const productDOM = addToCartButtonDOM.parentNode;
    const product = {
      //It is impoertant to have access to product values, therefore we created product object so that we can add products to the cart by creating DOM elements and can have access to them in the DOM
      image: productDOM.querySelector(".product__image").getAttribute("src"),
      name: productDOM.querySelector(".product__name").innerText,
      price: productDOM.querySelector(".product__price").innerText,
      quantity: 1
    };

    const isInCart =
      cart.filter(cartItem => cartItem.name === product.name).length > 0;
    if (isInCart === false) {
      insertItemToDOM(product); //refactoring
      cart.push(product); // we we push product into our cart we also need to save it into local storage
      localStorage.setItem("cart", JSON.stringify(cart)); //To store cart in local strorage(local storage can only store in strings)we use setItem method which takes value only in string, therefore we will use JSON.stingify method to convert our array(JSON) into a string but the browswer will later convert it into JSON object
      countCartTotal();
      handleActionButtons(addToCartButtonDOM, product); //refactoring
    }
  });
});

function insertItemToDOM(product) {
  //we are referring to product object inside the function therefore we need to pass product object into the function
  cartDOM.insertAdjacentHTML(
    "beforeend",
    `
        <div class = "cart__item"> <img class = "cart__item__image" src = "${
          product.image
        }" alt="${product.name}">
        <h3 class = "cart__item__name">${product.name}</h3>
        <h3 class = "cart__item__price">${product.price}</h3>
        <button class ="btn btn-primary btn-small" data-action="DECREASE_ITEM">&minus;</button> 
        <h3 class = "cart__item__quantity">${product.quantity}</h3>
        <button class ="btn btn-primary btn-small" data-action="INCREASE_ITEM">&plus;</button> 
        <button class ="btn btn-danger btn-small" data-action="REMOVE_ITEM">&times;</button> 
        </div
        `
  );
  addCartFooter();
}

function handleActionButtons(addToCartButtonDOM, product) {
  addToCartButtonDOM.innerText = "Product is in Cart";
  addToCartButtonDOM.disabled = true;
  const cartItemsDOM = cartDOM.querySelectorAll(".cart__item");
  cartItemsDOM.forEach(cartItemDOM => {
    if (
      cartItemDOM.querySelector(".cart__item__name").innerText === product.name
    ) {
      cartItemDOM
        .querySelector('[data-action="INCREASE_ITEM"]')
        .addEventListener("click", () => increaseItem(product, cartItemDOM));

      cartItemDOM
        .querySelector('[data-action="DECREASE_ITEM"]')
        .addEventListener("click", () =>
          decreaseItem(product, cartItemDOM, addToCartButtonDOM)
        );

      cartItemDOM
        .querySelector('[data-action="REMOVE_ITEM"]')
        .addEventListener("click", () =>
          removeItem(product, cartItemDOM, addToCartButtonDOM)
        );
    }
  });
}

function increaseItem(product, cartItemDOM) {
  cart.forEach(cartItem => {
    //we are changing the quantity in the cart array so we have to save the state in the local storage also.
    if (cartItem.name === product.name) {
      //cartItem.quantity++;
      cartItemDOM.querySelector(
        ".cart__item__quantity"
      ).innerText = ++cartItem.quantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      countCartTotal();
    }
  });
}

function decreaseItem(product, cartItemDOM, addToCartButtonDOM) {
  cart.forEach(cartItem => {
    if (cartItem.name === product.name) {
      //cartItem.quantity--;
      if (cartItem.quantity > 1) {
        //we are changing the quantity in the cart array so we have to save the state in the local storage also.
        cartItemDOM.querySelector(
          ".cart__item__quantity"
        ).innerText = --cartItem.quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        countCartTotal();
      } else {
        removeItem(product, cartItemDOM, addToCartButtonDOM);
      }
    }
  });
}

function removeItem(product, cartItemDOM, addToCartButtonDOM) {
  //cart.forEach(cartItem => {
  //if (cartItem.name === product.name) {
  //cartItem.quantity--;

  cartItemDOM.classList.add("cart__item--removed");
  setTimeout(() => cartItemDOM.remove(), 200);
  cart = cart.filter(cartItem => cartItem.name !== product.name);
  localStorage.setItem("cart", JSON.stringify(cart));
  countCartTotal();
  addToCartButtonDOM.innerText = "Add To Cart";
  addToCartButtonDOM.disabled = false;

  if (cart.length < 1) {
    document.querySelector(".cart-footer").remove();
  }
}

function addCartFooter() {
  if (document.querySelector(".cart-footer") === null) {
    cartDOM.insertAdjacentHTML(
      "afterend",
      ` <div class = "cart-footer">
   <button class = "btn btn-danger" data-action="CLEAR_CART">Clear Cart</button>
   <button class = "btn btn-success " data-action="CHECKOUT">Pay</button>
  </div>`
    );

    document
      .querySelector('[data-action = "CLEAR_CART"]')
      .addEventListener("click", () => clearCart());
    document
      .querySelector('[data-action="CHECKOUT"]')
      .addEventListener("click", () => checkout());
  }
}
function clearCart() {
  cartDOM.querySelectorAll(".cart__item").forEach(cartItemDOM => {
    cartItemDOM.classList.add("cart__item--removed");
    setTimeout(() => cartItemDOM.remove(), 250);
  });
  cart = []; //we also want to empty/remove items from cart array.
  localStorage.removeItem("cart");
  document.querySelector(".cart-footer").remove(); //remove cart-footer
  addToCartButtonsDOM.forEach(addToCartButtonDOM => {
    addToCartButtonDOM.innerText = "Add To Cart";
    addToCartButtonDOM.disabled = false;
  });
}
function checkout() {
  let payPalFormHTML = `
  <form id ="paypal-form" action="https://www.paypal.com/cgi-bin/webscr" method="post">
    <input type="hidden" name="cmd" value="_cart">
    <input type="hidden" name="upload" value="1">
    <input type="hidden" name="business" value="zeeshanhyf@gmail.com">
    `;

  cart.forEach((cartItem, index) => {
    ++index;
    payPalFormHTML += `
      <input type="hidden" name="item_name_${index}" value="${cartItem.name}">
      <input type="hidden" name="amount_${index}" value="${cartItem.price}">
      <input type="hidden" name="quantity_${index}" value="${
      cartItem.quantity
    }">
      `;
  });
  payPalFormHTML += `
    <input type="submit" value="PayPal">
    </form>
    <div class = "overlay"></div> `;

  document
    .querySelector("body")
    .insertAdjacentHTML("beforeend", payPalFormHTML);
  document.getElementById("paypal-form").submit();
}

function countCartTotal() {
  let cartTotal = 0;
  cart.forEach(cartItem => {
    cartTotal += cartItem.price * cartItem.quantity;
    console.log(cartTotal);
    document.querySelector(
      '[data-action="CHECKOUT"]'
    ).innerHTML = `Pay $ ${cartTotal}`;
  });
}
