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
    cartDOM.insertAdjacentHTML(
      "beforeend",
      `
           <div class = "cart__item">
              <img class = "cart__item__image" src = "${product.image}" alt="${
        product.name
      }">
              <h3 class = "cart__item__name">${product.name}</h3>
              <h3 class = "cart__item__price">${product.price}</h3>
              <button class ="btn btn--primary btn--small" data-action="DECREASE_ITEM">&minus;</button> 
              <h3 class = "cart__item__quantity">${product.quantity}</h3>
              <button class ="btn btn--primary btn--small" data-action="INCREASE_ITEM">&plus;</button> 
              <button class ="btn btn--danger btn--small" data-action="REMOVE_ITEM">&times;</button> 
              </div
              `
    );
    addToCartButtonsDOM.forEach(addToCartButtonDOM => {
      const productDOM = addToCartButtonDOM.parentNode;

      if (
        productDOM.querySelector(".product__name").innerText === product.name
      ) {
        addToCartButtonDOM.innerText = "Product is in Cart";
        addToCartButtonDOM.disabled = true;
        const cartItemsDOM = cartDOM.querySelectorAll(".cart__item");
        cartItemsDOM.forEach(cartItemDOM => {
          if (
            cartItemDOM.querySelector(".cart__item__name").innerText ===
            product.name
          ) {
            cartItemDOM
              .querySelector('[data-action="INCREASE_ITEM"]')
              .addEventListener("click", () => {
                cart.forEach(cartItem => {
                  //we are changing the quantity in the cart array so we have to save the state in the local storage also.
                  if (cartItem.name === product.name) {
                    //cartItem.quantity++;
                    cartItemDOM.querySelector(
                      ".cart__item__quantity"
                    ).innerText = ++cartItem.quantity;
                    localStorage.setItem("cart", JSON.stringify(cart));
                  }
                });
              });

            cartItemDOM
              .querySelector('[data-action="DECREASE_ITEM"]')
              .addEventListener("click", () => {
                cart.forEach(cartItem => {
                  if (cartItem.name === product.name) {
                    //cartItem.quantity--;
                    if (cartItem.quantity > 1) {
                      //we are changing the quantity in the cart array so we have to save the state in the local storage also.
                      cartItemDOM.querySelector(
                        ".cart__item__quantity"
                      ).innerText = --cartItem.quantity;
                      localStorage.setItem("cart", JSON.stringify(cart));
                    } else {
                      cartItemDOM.classList.add("cart__item--removed");
                      setTimeout(() => cartItemDOM.remove(), 200);
                      cart = cart.filter(
                        //we are changing the quantity in the cart array (by removing items) so we have to save the state in the local storage also.
                        cartItem => cartItem.name !== product.name
                      );
                      localStorage.setItem("cart", JSON.stringify(cart));
                      addToCartButtonDOM.innerText = "Add To Cart";
                      addToCartButtonDOM.disabled = false;
                    }
                  }
                });
              });

            cartItemDOM
              .querySelector('[data-action="REMOVE_ITEM"]')
              .addEventListener("click", () => {
                cart.forEach(cartItem => {
                  if (cartItem.name === product.name) {
                    //cartItem.quantity--;

                    cartItemDOM.classList.add("cart__item--removed");
                    setTimeout(() => cartItemDOM.remove(), 200);
                    cart = cart.filter(
                      cartItem => cartItem.name !== product.name
                    );
                    localStorage.setItem("cart", JSON.stringify(cart));
                    addToCartButtonDOM.innerText = "Add To Cart";
                    addToCartButtonDOM.disabled = false;
                  }
                });
              });
          }
        });
      }
    });
  });
}

addToCartButtonsDOM.forEach(addToCartButtonDOM => {
  addToCartButtonDOM.addEventListener("click", () => {
    const productDOM = addToCartButtonDOM.parentNode;
    const product = {
      image: productDOM.querySelector(".product__image").getAttribute("src"),
      name: productDOM.querySelector(".product__name").innerText,
      price: productDOM.querySelector(".product__price").innerText,
      quantity: 1
    };

    const isInCart =
      cart.filter(cartItem => cartItem.name === product.name).length > 0;
    if (isInCart === false) {
      cartDOM.insertAdjacentHTML(
        "beforeend",
        `
            <div class = "cart__item"> <img class = "cart__item__image" src = "${
              product.image
            }" alt="${product.name}">
            <h3 class = "cart__item__name">${product.name}</h3>
            <h3 class = "cart__item__price">${product.price}</h3>
            <button class ="btn btn--primary btn--small" data-action="DECREASE_ITEM">&minus;</button> 
            <h3 class = "cart__item__quantity">${product.quantity}</h3>
            <button class ="btn btn--primary btn--small" data-action="INCREASE_ITEM">&plus;</button> 
            <button class ="btn btn--danger btn--small" data-action="REMOVE_ITEM">&times;</button> 
            </div
            `
      );

      cart.push(product); // we we push product into our cart we also need to save it into local storage
      localStorage.setItem("cart", JSON.stringify(cart)); //To store cart in local strorage(local storage can only store in strings)we use setItem method which takes value only in string, therefore we will use JSON.stingify method to convert our array(JSON) into a string but the browswer will later convert it into JSON object
      addToCartButtonDOM.innerText = "Product is in Cart";
      addToCartButtonDOM.disabled = true;
      const cartItemsDOM = cartDOM.querySelectorAll(".cart__item");
      cartItemsDOM.forEach(cartItemDOM => {
        if (
          cartItemDOM.querySelector(".cart__item__name").innerText ===
          product.name
        ) {
          cartItemDOM
            .querySelector('[data-action="INCREASE_ITEM"]')
            .addEventListener("click", () => {
              cart.forEach(cartItem => {
                //we are changing the quantity in the cart array so we have to save the state in the local storage also.
                if (cartItem.name === product.name) {
                  //cartItem.quantity++;
                  cartItemDOM.querySelector(
                    ".cart__item__quantity"
                  ).innerText = ++cartItem.quantity;
                  localStorage.setItem("cart", JSON.stringify(cart));
                }
              });
            });

          cartItemDOM
            .querySelector('[data-action="DECREASE_ITEM"]')
            .addEventListener("click", () => {
              cart.forEach(cartItem => {
                if (cartItem.name === product.name) {
                  //cartItem.quantity--;
                  if (cartItem.quantity > 1) {
                    //we are changing the quantity in the cart array so we have to save the state in the local storage also.
                    cartItemDOM.querySelector(
                      ".cart__item__quantity"
                    ).innerText = --cartItem.quantity;
                    localStorage.setItem("cart", JSON.stringify(cart));
                  } else {
                    cartItemDOM.classList.add("cart__item--removed");
                    setTimeout(() => cartItemDOM.remove(), 200);
                    cart = cart.filter(
                      //we are changing the quantity in the cart array (by removing items) so we have to save the state in the local storage also.
                      cartItem => cartItem.name !== product.name
                    );
                    localStorage.setItem("cart", JSON.stringify(cart));
                    addToCartButtonDOM.innerText = "Add To Cart";
                    addToCartButtonDOM.disabled = false;
                  }
                }
              });
            });

          cartItemDOM
            .querySelector('[data-action="REMOVE_ITEM"]')
            .addEventListener("click", () => {
              cart.forEach(cartItem => {
                if (cartItem.name === product.name) {
                  //cartItem.quantity--;

                  cartItemDOM.classList.add("cart__item--removed");
                  setTimeout(() => cartItemDOM.remove(), 200);
                  cart = cart.filter(
                    cartItem => cartItem.name !== product.name
                  );
                  localStorage.setItem("cart", JSON.stringify(cart));
                  addToCartButtonDOM.innerText = "Add To Cart";
                  addToCartButtonDOM.disabled = false;
                }
              });
            });
        }
      });
    }
  });
});
