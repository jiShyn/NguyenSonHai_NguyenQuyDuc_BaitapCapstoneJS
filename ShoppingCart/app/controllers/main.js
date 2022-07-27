const productList = [];
const cart = JSON.parse(localStorage.getItem("cart")) || [];

main();

function main() {
   apiGetProducts()
      .then((result) => {
         result.data.forEach((product) => {
            const newProduct = new Product(
               product.id,
               product.name,
               product.price,
               product.screen,
               product.backCamera,
               product.frontCamera,
               product.img,
               product.desc,
               product.type
            );
            productList.push(newProduct);
         });

         display(productList);

         openModal();

         handleActionProduct();
      })
      .catch((error) => {
         console.log(error);
      });
}

// Hàm hiển thị
function display(productList) {
   let html = "";
   productList.forEach((product, index) => {
      html += /*html */ `
		   <div class="card">
                     <div class="card-top">
                     <span>${product.type}</span>
                        <span class="stocks">In Stock</span>
                     </div>
                     <div class="wrapper-img">
                        <img src="${product.img}" class="img-fluid d-block" alt="">
                        <div class="out-of-stock-cover">
                           <span>Out Of Stock</span>
                        </div>
                     </div>
                     <div class="card-body details">
                        <div class="name-fav">
                           <span class="product-name">${product.name}</span>
                           <button class="heart">
                              <i class="fa-solid fa-heart"></i>
                           </button>
                        </div>
                        <div class="desc">
                           <!-- <h5>Wireless Noise Cancelling Earphones</h5> -->
                           <p>${product.desc}</p>
                           <p>Camera sau: ${product.backCamera}</p>
                           <p>Camera trước: ${product.frontCamera}</p>
                        </div>
                        <div class="purchase">
                           <p class="product-price">$ ${product.price}</p>
                           <div class="btn-add">
                              
                                 <button class="add-btn" data-index='${index}' data-id="${product.id}">
                                    Add
                                    <i class="fa-solid fa-chevron-right"></i>
                                 </button>
                              
                           </div>

                           <div class="quantity">
                              <span class="quantity-actions quantity-decrease" data-action-id="${product.id}" data-action="decrease"><</span>
                              <span class="quantity-number">1</span>
                              <span class="quantity-actions quantity-increase" data-action-id="${product.id}" data-action="increase">></span>
                           </div>
                        </div>
                     </div>
                  </div>
		`;
   });

   document.querySelector(".wrapper-card").innerHTML = html;

   // console.log(cart);
   if (cart.length > 0) {
      displayQuantityCartItem();
      // handleActionProduct();
   }
}

//Hàm gắn onChange để lọc sản phẩm
function filterTypePhone() {
   document.getElementById("select-type").addEventListener("click", (event) => {
      let type = event.target.value;
      if (type === "") type = undefined;

      apiGetProducts(type)
         .then((result) => {
            display(result.data);
         })
         .catch((error) => {
            console.log(error);
         });
   });
}

// hàm ấn nút giỏ hàng sẽ mở modal
function openModal() {
   document.querySelector(".wrapper-icon").addEventListener("click", () => {
      document.querySelector(".overlay").style.display = "flex";
   });

   displayModal();
   // updateProductCart();
   handleActionProductCart();
   closeModal();
}

//hàm đóng modal
function closeModal() {
   document.querySelector(".modal-close").addEventListener("click", () => {
      document.querySelector(".overlay").style.display = "none";
   });
}

//hàm hiển thị giao diện ra modal
function displayModal() {
   document.querySelector(".modal").innerHTML = /*html */ `
               <div class="modal-header">
                  <div class="modal-close">
                     <span>X</span>
                  </div>
                  <h1>Cart</h1>
               </div>
               <table>
                  <thead>
                     <tr>
                        <th>Img</th>
                        <th>Name</th>
                        <th>Decrease/Increase</th>
                        <th>Price</th>
                        <th>Remove</th>
                     </tr>
                  </thead>
                  <tbody id="tblCart">
                  </tbody>
               </table>
               <div class="modal-footer">
                  <h1 class="total">
                  <span>Total</span>
                  <span id="total-number">$...</span>
                  </h1>
                  <button>Purchase</button>
                  <button onclick="clearCart()">Clear Cart</button>
               </div>
   `;

   updateProductCart();
}

//hàm hiển thị sản phẩm trong giỏ hàng ra modal
function updateProductCart() {
   let html = "";

   cart.forEach((product, index) => {
      html += /*html */ `
      <tr>
         <td>
            <img width="50px" height="50px" src="${
               product.product.img
            }" alt="Image" />
         </td>
         <td>${product.product.name}</td>
         <td>
            <span class="cart-quantity-action" data-index-cart="${index}" data-action-id="${
         product.product.id
      }" data-action="decrease"><</span>
            <span class="cart-quantity-number">${product.quantity}</span>
            <span class="cart-quantity-action" data-index-cart="${index}" data-action-id="${
         product.product.id
      }" data-action="increase">></span>
         </td>
         <td>${(product.product.price * product.quantity).toLocaleString(
            "en-US",
            { style: "currency", currency: "USD" }
         )}</td>
         <td><i class="fa-solid fa-trash" onclick="removeCartItem('${
            product.product.id
         }')"></i></td>
      </tr>
          `;
   });

   document.getElementById("tblCart").innerHTML = html;

   const html_2 = cart.reduce((total, product, index, arr) => {
      return total + product.product.price * product.quantity;
   }, 0);

   // console.log("html_2:", html_2);

   document.getElementById("total-number").innerHTML = `${html_2.toLocaleString(
      "en-US",
      {
         style: "currency",
         currency: "USD",
      }
   )}`;
}

//hàm lắng nghe click trong thẻ tblCart để tăng/giảm số lượng SP giỏ hàng
function handleActionProductCart() {
   document.getElementById("tblCart")?.addEventListener("click", (evt) => {
      const indexProductCart = evt.target.getAttribute("data-index-cart");
      const action = evt.target.getAttribute("data-action");
      const productCartId = evt.target.getAttribute("data-action-id");

      if (!indexProductCart) return;

      switch (action) {
         case "decrease":
            if (cart[indexProductCart].quantity >= 1) {
               cart[indexProductCart].quantity--;

               //xóa data cũ và lưu cart vào localStorage
               localStorage.clear();
               localStorage.setItem("cart", JSON.stringify(cart));

               document.querySelectorAll(".cart-quantity-number")[
                  indexProductCart
               ].innerHTML = cart[indexProductCart].quantity;

               updateProductCart();
            }
            break;
         case "increase":
            if (cart[indexProductCart].quantity <= 9) {
               cart[indexProductCart].quantity++;

               //xóa data cũ và lưu cart vào localStorage
               localStorage.clear();
               localStorage.setItem("cart", JSON.stringify(cart));

               document.querySelectorAll(".cart-quantity-number")[
                  indexProductCart
               ].innerHTML = cart[indexProductCart].quantity;

               updateProductCart();
            }
            break;
      }

      const indexProductFromCartItemId =
         findIndexProductFromCartItemId(productCartId);

      document.querySelectorAll(".quantity-number")[
         indexProductFromCartItemId
      ].innerHTML = cart[indexProductCart].quantity;
   });
}

//hàm lắng nghe click ở trong thẻ wrapper-card để tăng/giảm số lượng SP giỏ hàng
function handleActionProduct() {
   document.querySelector(".wrapper-card").addEventListener("click", (evt) => {
      //Add sản phẩm
      const productId = evt.target.getAttribute("data-id");
      const index = productList.findIndex((product) => {
         return product.id === productId;
      });

      const selectedProduct = productList[index];

      if (selectedProduct) {
         const cartItem = {
            product: selectedProduct,
            quantity: 1,
         };
         cart.push(cartItem);

         //xóa data cũ và lưu cart vào localStorage
         localStorage.clear();
         localStorage.setItem("cart", JSON.stringify(cart));

         updateProductCart();
      }

      const indexToRemove = evt.target.getAttribute("data-index");

      if (document.querySelectorAll(".btn-add")[indexToRemove]) {
         console.log(cart, cart.length);
         document.querySelectorAll(".btn-add")[indexToRemove].style.display =
            "none";
      }

      //Nếu có class quantity mới chạy logic tăng/giảm số lượng sản phẩm
      if (document.querySelectorAll(".quantity")[indexToRemove]) {
         document.querySelectorAll(".quantity")[indexToRemove].style.display =
            "flex";

         const selectedQuantity =
            document.querySelectorAll(".quantity")[indexToRemove];
         const selectedQuantityNumber =
            document.querySelectorAll(".quantity-number")[indexToRemove];

         selectedQuantity.addEventListener("click", (event) => {
            const action = event.target.getAttribute("data-action");
            const productId = event.target.getAttribute("data-action-id");
            // console.log("action:", action);
            // console.log("productId:", productId);

            switch (action) {
               case "decrease":
                  selectedQuantityNumber.innerHTML = decreaseProduct(productId);
                  //xóa data cũ và lưu cart vào localStorage
                  localStorage.clear();
                  localStorage.setItem("cart", JSON.stringify(cart));
                  updateProductCart();
                  break;
               case "increase":
                  selectedQuantityNumber.innerHTML = increaseProduct(productId);
                  //xóa data cũ và lưu cart vào localStorage
                  localStorage.clear();
                  localStorage.setItem("cart", JSON.stringify(cart));
                  updateProductCart();
                  break;
            }
         });
      }
   });
}

//Hàm tìm index cartItem
function findIndexCartItem(productId) {
   console.log("currentCart:", cart);
   const indexCart = cart.findIndex((cartItem) => {
      return cartItem.product.id === productId;
   });
   // console.log("Vị trí cartItem cần tăng/giảm số lượng", indexCart);
   return indexCart;
}

//hàm tìm index quantity-number của productList
function findIndexProductFromCartItemId(productCartId) {
   const index = productList.findIndex((product) => {
      return product.id === productCartId;
   });

   if (index !== -1) {
      return index;
   }
}

//hàm giảm số lượng SP giỏ hàng
function decreaseProduct(productId) {
   const indexCart = findIndexCartItem(productId);

   if (indexCart !== -1 && cart[indexCart].quantity >= 1) {
      //kiểm tra quantity <0 hay >0
      // console.log(
      //    "Quantity của cartItem TRƯỚC khi GIẢM",
      //    cart[indexCart].quantity
      // );
      cart[indexCart].quantity--;
      // console.log(
      //    "Quantity của cartItem SAU khi GIẢM",
      //    cart[indexCart].quantity
      // );
   }
   return cart[indexCart].quantity;
}

//Hàm tăng số lượng SP giỏ hàng
function increaseProduct(productId) {
   const indexCart = findIndexCartItem(productId);

   if (indexCart !== -1 && cart[indexCart].quantity <= 9) {
      //kiểm tra quantity <0 hay >0
      // console.log(
      //    "Quantity của cartItem TRƯỚC khi TĂNG",
      //    cart[indexCart].quantity
      // );
      cart[indexCart].quantity++;
      // console.log(
      //    "Quantity của cartItem SAU khi TĂNG",
      //    cart[indexCart].quantity
      // );
   }
   return cart[indexCart].quantity;
}

//hàm clear giỏ hàng
function clearCart() {
   cart.splice(0, cart.length);

   //clear cart ở localStorage
   localStorage.clear();

   updateProductCart();

   display(productList);
}

// hàm remove cart item from tblCart
function removeCartItem(productId) {
   const indexCartItem = findIndexCartItem(productId);
   const indexProductItem = findIndexProductFromCartItemId(productId);

   cart.splice(indexCartItem, 1);

   //xóa data cũ và lưu cart vào localStorage
   localStorage.clear();
   localStorage.setItem("cart", JSON.stringify(cart));

   updateProductCart();

   document.querySelectorAll(".quantity-number")[indexProductItem].innerHTML =
      "1";
   document.querySelectorAll(".quantity")[indexProductItem].style.display =
      "none";
   document.querySelectorAll(".btn-add")[indexProductItem].style.display =
      "flex";
   // handleActionProduct()

   if (cart.length === 0) {
      display(productList);
   }
}

//hàm hiển thị quantity của cartItem ra giao diện khi trình duyệt load lần đầu
function displayQuantityCartItem() {
   productList.forEach((item, index) => {
      const indexInCart = cart.findIndex((cartItem) => {
         return cartItem.product.id === item.id;
      });

      if (cart[indexInCart]) {
         document.querySelectorAll(".btn-add")[index].style.display = "none";
         document.querySelectorAll(".quantity")[index].style.display = "flex";

         document.querySelectorAll(".quantity-number")[index].innerHTML =
            cart[indexInCart]?.quantity;
         document
            .querySelectorAll(".quantity")
            [index].addEventListener("click", (event) => {
               const action = event.target.getAttribute("data-action");
               const productId = event.target.getAttribute("data-action-id");

               switch (action) {
                  case "decrease":
                     document.querySelectorAll(".quantity-number")[index].innerHTML =
                        decreaseProduct(productId);
                     //xóa data cũ và lưu cart vào localStorage
                     localStorage.clear();
                     localStorage.setItem("cart", JSON.stringify(cart));
                     updateProductCart();
                     break;
                  case "increase":
                     document.querySelectorAll(".quantity-number")[index].innerHTML =
                        increaseProduct(productId);
                     //xóa data cũ và lưu cart vào localStorage
                     localStorage.clear();
                     localStorage.setItem("cart", JSON.stringify(cart));
                     updateProductCart();
                     break;
               }
            });
      }
   });
}
