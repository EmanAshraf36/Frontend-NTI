//Helpers
function el(id) {
  return document.getElementById(id);
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// shows the message under the field if isValid is false, and returns isValid
function check(errorId, isValid, message) {
  el(errorId).innerHTML = isValid ? "" : message;
  return isValid;
}

function clearInputs(ids) {
  for (var i = 0; i < ids.length; i++) {
    el(ids[i]).value = "";
  }
}

function findProduct(id) {
  var products = getData("products");
  for (var i = 0; i < products.length; i++) {
    if (products[i].id == id) return products[i];
  }
  return null;
}

//Default data
if (localStorage.getItem("users") == null) {
  saveData("users", [{ name: "Admin", email: "admin@shop.com", password: "Admin123", role: "admin" }]);
}

if (localStorage.getItem("products") == null) {
  saveData("products", [
    { id: 1, name: "Laptop", price: 25000, category: "electronics", image: "https://placehold.co/300x200?text=Laptop", description: "Fast laptop with 16GB RAM.", stock: 5 },
    { id: 2, name: "Headphones", price: 1500, category: "electronics", image: "https://placehold.co/300x200?text=Headphones", description: "Wireless headphones with good sound.", stock: 10 },
    { id: 3, name: "Smart Watch", price: 3000, category: "electronics", image: "https://placehold.co/300x200?text=Smart+Watch", description: "Tracks your steps and sleep.", stock: 0 },
    { id: 4, name: "T-Shirt", price: 350, category: "clothes", image: "https://placehold.co/300x200?text=T-Shirt", description: "Cotton t-shirt for every day.", stock: 20 },
    { id: 5, name: "Jacket", price: 1200, category: "clothes", image: "https://placehold.co/300x200?text=Jacket", description: "Warm jacket for the winter.", stock: 7 },
    { id: 6, name: "Hand Bag", price: 750, category: "accessories", image: "https://placehold.co/300x200?text=Bag", description: "Leather bag with two pockets.", stock: 4 },
    { id: 7, name: "Gold Ring", price: 5000, category: "accessories", image: "https://placehold.co/300x200?text=Ring", description: "Small gold ring, a great gift.", stock: 3 }
  ]);
  saveData("categories", ["electronics", "clothes", "accessories"]);
}

var user = JSON.parse(localStorage.getItem("currentUser"));

//Pages
function showPage(page) {

  if ((page == "shop" || page == "cart" || page == "review") && (user == null || user.role != "customer")) page = "login";
  if (page == "admin" && (user == null || user.role != "admin")) page = "login";

  var pages = ["login", "register", "shop", "review", "cart", "admin"];
  for (var i = 0; i < pages.length; i++) {
    el(pages[i] + "Page").classList.add("d-none");
  }
  el(page + "Page").classList.remove("d-none");
  showNav();

  if (page == "shop") {
    showCategoryFilter();
    showProducts();
  }
  if (page == "review") {
    showReviews();
  }
  if (page == "cart") {
    showCart();
    showWishlist();
    showMyOrders();
    showPayPal();
  }
  if (page == "admin") {
    showAdminProducts();
    showCategories();
    showAllOrders();
    showAdmins();
  }
}

function showNav() {
  var html = "";
  if (user != null && user.role == "customer") {
    html = `<span class="text-white me-2">Hello, ${user.name}</span>
      <button class="btn btn-outline-light btn-sm" onclick="showPage('shop')">Products</button>
      <button class="btn btn-outline-light btn-sm" onclick="showPage('cart')">Cart & Orders</button>
      <button class="btn btn-danger btn-sm" onclick="logout()">Logout</button>`;
  }
  if (user != null && user.role == "admin") {
    html = `<a href="#adminProducts" class="btn btn-outline-light btn-sm">Products</a>
      <a href="#adminCategories" class="btn btn-outline-light btn-sm">Categories</a>
      <a href="#adminOrders" class="btn btn-outline-light btn-sm">Orders</a>
      <a href="#adminAdmins" class="btn btn-outline-light btn-sm">Admins</a>
      <button class="btn btn-danger btn-sm" onclick="logout()">Logout</button>`;
  }
  el("navLinks").innerHTML = html;
}

//user login & register
var namePattern = /^[a-zA-Z ]{3,30}$/;
var emailPattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
var passwordPattern = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;

function emailExists(email) {
  var users = getData("users");
  for (var i = 0; i < users.length; i++) {
    if (users[i].email == email) return true;
  }
  return false;
}

function validateUser(prefix, name, email, password, confirm) {
  var ok = true;
  if (!check(prefix + "NameError", namePattern.test(name), "Name must be 3-30 letters")) ok = false;
  if (!check(prefix + "EmailError", emailPattern.test(email), "Enter a valid email, example: name@gmail.com")) ok = false;
  else if (!check(prefix + "EmailError", !emailExists(email), "This email is already registered")) ok = false;
  if (!check(prefix + "PasswordError", passwordPattern.test(password), "Password needs 6+ characters, 1 capital letter and 1 number")) ok = false;
  if (!check(prefix + "ConfirmError", confirm != "" && confirm == password, "Passwords do not match")) ok = false;
  return ok;
}

function login(loggedUser) {
  user = loggedUser;
  localStorage.setItem("currentUser", JSON.stringify(user));
  showPage(user.role == "admin" ? "admin" : "shop");
}

function logout() {
  localStorage.removeItem("currentUser");
  user = null;
  showPage("login");
}

el("loginBtn").addEventListener("click", function () {
  var email = el("loginEmail").value.trim();
  var password = el("loginPassword").value;

  check("loginError", true, "");
  var ok = check("loginEmailError", emailPattern.test(email), "Enter a valid email");
  if (!check("loginPasswordError", password != "", "Password is required")) ok = false;
  if (!ok) return;

  var users = getData("users");
  for (var i = 0; i < users.length; i++) {
    if (users[i].email == email && users[i].password == password) {
      clearInputs(["loginEmail", "loginPassword"]);
      login(users[i]);
      return;
    }
  }
  check("loginError", false, "Wrong email or password");
});

el("registerBtn").addEventListener("click", function () {
  var name = el("regName").value.trim();
  var email = el("regEmail").value.trim();
  var password = el("regPassword").value;

  if (!validateUser("reg", name, email, password, el("regConfirm").value)) return;

  var newUser = { name: name, email: email, password: password, role: "customer" };
  var users = getData("users");
  users.push(newUser);
  saveData("users", users);

  clearInputs(["regName", "regEmail", "regPassword", "regConfirm"]);
  alert("Account created successfully");
  login(newUser);
});

//products 
el("search").addEventListener("input", showProducts);
el("categoryFilter").addEventListener("change", showProducts);
el("sortPrice").addEventListener("change", showProducts);

function showCategoryFilter() {
  var categories = getData("categories");
  var html = '<option value="all">All categories</option>';
  for (var i = 0; i < categories.length; i++) {
    html += `<option value="${categories[i]}">${categories[i]}</option>`;
  }
  el("categoryFilter").innerHTML = html;
}

function showProducts() {
  var search = el("search").value.toLowerCase();
  var category = el("categoryFilter").value;

  var products = getData("products").filter(function (p) {
    return p.name.toLowerCase().indexOf(search) != -1 && (category == "all" || p.category == category);
  });

  if (el("sortPrice").value == "low") products.sort(function (a, b) { return a.price - b.price; });
  if (el("sortPrice").value == "high") products.sort(function (a, b) { return b.price - a.price; });

  var html = "";
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    html += `
      <div class="col-md-3 mb-4">
        <div class="card h-100">
          <img src="${p.image}" class="card-img-top" alt="${p.name}">
          <div class="card-body">
            <h5>${p.name}</h5>
            <span class="badge bg-secondary">${p.category}</span>
            <p class="stars mb-1">${stars(averageRating(p.id))} <small class="text-muted">(${productReviews(p.id).length})</small></p>
            <p class="small">${p.description}</p>
            <p class="fw-bold">${p.price} EGP</p>
            <p class="small">${p.stock > 0 ? "In stock: " + p.stock : '<span class="text-danger">Out of stock</span>'}</p>
            <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})">Add to cart</button>
            <button class="btn btn-outline-danger btn-sm" onclick="addToWishlist(${p.id})">&#9829;</button>
            <button class="btn btn-outline-secondary btn-sm" onclick="openReviews(${p.id})">Reviews</button>
          </div>
        </div>
      </div>`;
  }
  el("productsList").innerHTML = html || "<p>No products found</p>";
}

//Customer: cart & wishlist
function cartKey() { return "cart_" + user.email; }
function wishlistKey() { return "wishlist_" + user.email; }

// adds 1 piece, returns true if it worked
function addToCart(id) {
  var product = findProduct(id);
  var cart = getData(cartKey());
  var item = null;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) item = cart[i];
  }

  var qtyInCart = item ? item.qty : 0;
  if (qtyInCart + 1 > product.stock) {
    alert(product.stock == 0 ? "Sorry, this product is out of stock" : "Only " + product.stock + " in stock");
    return false;
  }

  if (item) item.qty++;
  else cart.push({ id: id, qty: 1 });
  saveData(cartKey(), cart);
  alert(product.name + " added to cart");
  return true;
}

function addToWishlist(id) {
  var wishlist = getData(wishlistKey());
  if (wishlist.indexOf(id) != -1) {
    alert("Already in your wishlist");
    return;
  }
  wishlist.push(id);
  saveData(wishlistKey(), wishlist);
  alert("Added to wishlist");
}

function cartTotal() {
  var cart = getData(cartKey());
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    var product = findProduct(cart[i].id);
    if (product) total += product.price * cart[i].qty;
  }
  return total;
}

function showCart() {
  var cart = getData(cartKey());
  var html = "";
  for (var i = 0; i < cart.length; i++) {
    var p = findProduct(cart[i].id);
    if (p == null) continue; // deleted by admin
    html += `
      <tr>
        <td>${p.name}</td>
        <td>${p.price} EGP</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="changeQty(${p.id}, -1)">-</button>
          ${cart[i].qty}
          <button class="btn btn-sm btn-secondary" onclick="changeQty(${p.id}, 1)">+</button>
        </td>
        <td>${p.price * cart[i].qty} EGP</td>
        <td><button class="btn btn-sm btn-danger" onclick="removeFromCart(${p.id})">Remove</button></td>
      </tr>`;
  }
  el("cartTable").innerHTML = html || '<tr><td colspan="5">Your cart is empty</td></tr>';
  el("cartTotal").innerHTML = cartTotal();
  el("usdTotal").innerHTML = toUSD(cartTotal());
}

function changeQty(id, amount) {
  var cart = getData(cartKey());
  var product = findProduct(id);
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      var newQty = cart[i].qty + amount;
      if (newQty < 1) return;
      if (newQty > product.stock) {
        alert("Only " + product.stock + " in stock");
        return;
      }
      cart[i].qty = newQty;
    }
  }
  saveData(cartKey(), cart);
  showCart();
}

function removeFromCart(id) {
  var cart = getData(cartKey()).filter(function (item) { return item.id != id; });
  saveData(cartKey(), cart);
  showCart();
}

function showWishlist() {
  var wishlist = getData(wishlistKey());
  var html = "";
  for (var i = 0; i < wishlist.length; i++) {
    var p = findProduct(wishlist[i]);
    if (p == null) continue;
    html += `
      <tr>
        <td><img src="${p.image}" width="60"></td>
        <td>${p.name}</td>
        <td>${p.price} EGP</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="moveToCart(${p.id})">Move to cart</button>
          <button class="btn btn-sm btn-danger" onclick="removeFromWishlist(${p.id})">Remove</button>
        </td>
      </tr>`;
  }
  el("wishlistTable").innerHTML = html || "<tr><td>Your wishlist is empty</td></tr>";
}

function removeFromWishlist(id) {
  var wishlist = getData(wishlistKey()).filter(function (itemId) { return itemId != id; });
  saveData(wishlistKey(), wishlist);
  showWishlist();
}

function moveToCart(id) {
  if (addToCart(id)) {
    removeFromWishlist(id);
    showCart();
  }
}

//Placing orders
function placeOrder(payment) {
  var cart = getData(cartKey());
  var items = [];
  for (var i = 0; i < cart.length; i++) {
    var p = findProduct(cart[i].id);
    if (p) items.push({ id: p.id, name: p.name, price: p.price, qty: cart[i].qty });
  }
  if (items.length == 0) {
    alert("Your cart is empty");
    return;
  }

  var orders = getData("orders");
  orders.push({
    id: orders.length + 1,
    email: user.email,
    customer: user.name,
    date: new Date().toLocaleString(),
    items: items,
    total: cartTotal(),
    payment: payment,
    status: "pending"
  });
  saveData("orders", orders);
  saveData(cartKey(), []);
  alert("Order placed! It is pending until the admin confirms it.");
  showPage("cart");
}

el("orderBtn").addEventListener("click", function () {
  placeOrder("Cash on delivery");
});

var EGP_PER_USD = 50;
var paypalShown = false;

function toUSD(egp) {
  return (egp / EGP_PER_USD).toFixed(2);
}

function showPayPal() {
  if (paypalShown || typeof paypal == "undefined") return; 
  paypalShown = true;

  paypal.Buttons({
    onClick: function (data, actions) {
      if (cartTotal() == 0) {
        alert("Your cart is empty");
        return actions.reject();
      }
      return actions.resolve();
    },
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{ amount: { currency_code: "USD", value: toUSD(cartTotal()) } }]
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        placeOrder("PayPal (paid) " + details.id);
      });
    },
    onError: function () {
      alert("PayPal payment failed, please try again");
    }
  }).render("#paypalButtons");
}

//Orders
var statusColors = {
  "pending": "bg-warning",
  "confirmed": "bg-success",
  "rejected": "bg-danger",
  "return requested": "bg-info",
  "returned": "bg-secondary",
  "return rejected": "bg-dark"
};

function orderRow(order, buttons) {
  var products = "";
  for (var i = 0; i < order.items.length; i++) {
    products += order.items[i].name + " x" + order.items[i].qty + "<br>";
  }
  var reason = order.returnReason ? "<br><small>" + order.returnReason + "</small>" : "";
  return `
    <tr>
      <td>${order.id}</td>
      <td>${order.customer}<br><small>${order.date}</small></td>
      <td>${products}</td>
      <td>${order.total} EGP</td>
      <td>${order.payment}</td>
      <td><span class="badge ${statusColors[order.status]}">${order.status}</span>${reason}</td>
      <td>${buttons}</td>
    </tr>`;
}

function setStatus(id, status) {
  var orders = getData("orders");
  orders[id - 1].status = status;
  saveData("orders", orders);
}

function changeStock(order, sign) {
  var products = getData("products");
  for (var i = 0; i < order.items.length; i++) {
    for (var j = 0; j < products.length; j++) {
      if (products[j].id == order.items[i].id) {
        products[j].stock += sign * order.items[i].qty;
      }
    }
  }
  saveData("products", products);
}

function showMyOrders() {
  var orders = getData("orders");
  var html = "";
  for (var i = orders.length - 1; i >= 0; i--) {
    if (orders[i].email != user.email) continue;
    var button = "";
    if (orders[i].status == "confirmed") {
      button = `<button class="btn btn-sm btn-warning" onclick="requestReturn(${orders[i].id})">Return</button>`;
    }
    html += orderRow(orders[i], button);
  }
  el("myOrdersTable").innerHTML = html || '<tr><td colspan="7">No orders yet</td></tr>';
}

function requestReturn(id) {
  var reason = prompt("Why do you want to return this order?");
  if (reason == null) return; // Cancel
  if (reason.trim().length < 5) {
    alert("Please write a reason (at least 5 characters)");
    return;
  }
  var orders = getData("orders");
  orders[id - 1].status = "return requested";
  orders[id - 1].returnReason = "Return reason: " + reason.trim();
  saveData("orders", orders);
  showPage("cart");
}

function showAllOrders() {
  var orders = getData("orders");
  var html = "";
  for (var i = orders.length - 1; i >= 0; i--) {
    var id = orders[i].id;
    var buttons = "";
    if (orders[i].status == "pending") {
      buttons = `<button class="btn btn-sm btn-success" onclick="confirmOrder(${id})">Confirm</button>
                 <button class="btn btn-sm btn-danger" onclick="rejectOrder(${id})">Reject</button>`;
    }
    if (orders[i].status == "return requested") {
      buttons = `<button class="btn btn-sm btn-success" onclick="acceptReturn(${id})">Accept return</button>
                 <button class="btn btn-sm btn-danger" onclick="rejectReturn(${id})">Reject return</button>`;
    }
    html += orderRow(orders[i], buttons);
  }
  el("allOrdersTable").innerHTML = html || '<tr><td colspan="7">No orders yet</td></tr>';
}

function confirmOrder(id) {
  var order = getData("orders")[id - 1];
  for (var i = 0; i < order.items.length; i++) {
    var p = findProduct(order.items[i].id);
    if (p == null || p.stock < order.items[i].qty) {
      alert("Not enough stock for " + order.items[i].name);
      return;
    }
  }
  changeStock(order, -1);
  setStatus(id, "confirmed");
  showPage("admin");
}

function rejectOrder(id) {
  if (!confirm("Reject order #" + id + "?")) return;
  setStatus(id, "rejected");
  showPage("admin");
}

function acceptReturn(id) {
  var order = getData("orders")[id - 1];
  changeStock(order, 1);
  setStatus(id, "returned");
  if (order.payment.indexOf("PayPal") == 0) {
    alert("Remember to refund this order from your PayPal sandbox account");
  }
  showPage("admin");
}

function rejectReturn(id) {
  setStatus(id, "return rejected");
  showPage("admin");
}

//Reviews
var reviewProductId = null;

function productReviews(id) {
  return getData("reviews").filter(function (r) { return r.productId == id; });
}

function averageRating(id) {
  var reviews = productReviews(id);
  if (reviews.length == 0) return 0;
  var sum = 0;
  for (var i = 0; i < reviews.length; i++) {
    sum += reviews[i].rating;
  }
  return sum / reviews.length;
}

function stars(rating) {
  var n = Math.round(rating);
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function openReviews(id) {
  reviewProductId = id;
  showPage("review");
}

function showReviews() {
  var p = findProduct(reviewProductId);
  var reviews = productReviews(reviewProductId);
  el("reviewProduct").innerHTML = `
    <h4>${p.name}</h4>
    <p><span class="stars">${stars(averageRating(p.id))}</span> ${averageRating(p.id).toFixed(1)} / 5 (${reviews.length} reviews)</p>`;

  var html = "";
  for (var i = 0; i < reviews.length; i++) {
    html += `<div class="border-top py-2">
      <b>${reviews[i].name}</b> <span class="stars">${stars(reviews[i].rating)}</span>
      <p class="mb-0">${reviews[i].comment}</p>
    </div>`;
  }
  el("reviewsList").innerHTML = html || "<p>No reviews yet</p>";
}

el("reviewBtn").addEventListener("click", function () {
  var rating = el("reviewRating").value;
  var comment = el("reviewComment").value.trim();
  var ok = check("reviewRatingError", rating != "", "Please choose a rating");
  if (!check("reviewCommentError", comment.length >= 5, "Feedback must be at least 5 characters")) ok = false;
  if (!ok) return;

  // remove my old review of this product (if any), then add the new one
  var reviews = getData("reviews").filter(function (r) {
    return !(r.productId == reviewProductId && r.email == user.email);
  });
  reviews.push({ productId: reviewProductId, email: user.email, name: user.name, rating: Number(rating), comment: comment });
  saveData("reviews", reviews);

  clearInputs(["reviewRating", "reviewComment"]);
  showReviews();
});

//Admin
var editProductId = null; 

function showAdminProducts() {
  var products = getData("products");
  var html = "";
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    html += `
      <tr>
        <td>${p.id}</td>
        <td><img src="${p.image}" width="60"></td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${p.price} EGP</td>
        <td>${p.stock}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editProduct(${p.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">Delete</button>
        </td>
      </tr>`;
  }
  el("adminProductsTable").innerHTML = html;
}

el("saveProductBtn").addEventListener("click", function () {
  var product = {
    name: el("pName").value.trim(),
    price: Number(el("pPrice").value),
    stock: el("pStock").value,
    category: el("pCategory").value,
    image: el("pImage").value.trim(),
    description: el("pDescription").value.trim()
  };

  var ok = true;
  if (!check("pNameError", product.name.length >= 3, "Name must be at least 3 characters")) ok = false;
  if (!check("pPriceError", product.price > 0, "Price must be more than 0")) ok = false;
  if (!check("pStockError", /^[0-9]+$/.test(product.stock), "Stock must be a whole number (0 or more)")) ok = false;
  if (!check("pCategoryError", product.category != "", "Choose a category")) ok = false;
  if (!check("pImageError", /^https?:\/\//.test(product.image), "Image link must start with http:// or https://")) ok = false;
  if (!check("pDescriptionError", product.description.length >= 10, "Description must be at least 10 characters")) ok = false;
  if (!ok) return;

  product.stock = Number(product.stock);
  var products = getData("products");

  if (editProductId == null) {
    var maxId = 0;
    for (var i = 0; i < products.length; i++) {
      if (products[i].id > maxId) maxId = products[i].id;
    }
    product.id = maxId + 1;
    products.push(product);
  } else {
    for (var j = 0; j < products.length; j++) {
      if (products[j].id == editProductId) {
        product.id = editProductId;
        products[j] = product;
      }
    }
  }

  saveData("products", products);
  alert("Product saved");
  clearProductForm();
  showAdminProducts();
});

function editProduct(id) {
  var p = findProduct(id);
  editProductId = id;
  el("pName").value = p.name;
  el("pPrice").value = p.price;
  el("pStock").value = p.stock;
  el("pCategory").value = p.category;
  el("pImage").value = p.image;
  el("pDescription").value = p.description;
  el("productFormTitle").innerHTML = "Edit Product #" + id;
  el("adminProducts").scrollIntoView();
}

function clearProductForm() {
  editProductId = null;
  clearInputs(["pName", "pPrice", "pStock", "pCategory", "pImage", "pDescription"]);
  el("productFormTitle").innerHTML = "Add Product";
}

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  var products = getData("products").filter(function (p) { return p.id != id; });
  saveData("products", products);
  showAdminProducts();
}

function categoryError(name, oldName) {
  if (!/^[a-z ]{3,20}$/.test(name)) return "Category must be 3-20 letters";
  if (name != oldName && getData("categories").indexOf(name) != -1) return "This category already exists";
  return "";
}

function showCategories() {
  var categories = getData("categories");
  var rows = "";
  var options = '<option value="">Choose category</option>';
  for (var i = 0; i < categories.length; i++) {
    rows += `<tr>
      <td>${categories[i]}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-warning" onclick="editCategory(${i})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCategory(${i})">Delete</button>
      </td>
    </tr>`;
    options += `<option value="${categories[i]}">${categories[i]}</option>`;
  }
  el("categoriesTable").innerHTML = rows;
  el("pCategory").innerHTML = options;
}

el("addCategoryBtn").addEventListener("click", function () {
  var name = el("categoryName").value.trim().toLowerCase();
  var error = categoryError(name, "");
  if (!check("categoryError", error == "", error)) return;

  var categories = getData("categories");
  categories.push(name);
  saveData("categories", categories);
  el("categoryName").value = "";
  showCategories();
});

function editCategory(index) {
  var categories = getData("categories");
  var oldName = categories[index];
  var name = prompt("New name for " + oldName + ":", oldName);
  if (name == null) return; // Cancel
  name = name.trim().toLowerCase();

  var error = categoryError(name, oldName);
  if (error != "") {
    alert(error);
    return;
  }

  categories[index] = name;
  saveData("categories", categories);

  var products = getData("products");
  for (var i = 0; i < products.length; i++) {
    if (products[i].category == oldName) products[i].category = name;
  }
  saveData("products", products);
  showPage("admin");
}

function deleteCategory(index) {
  var categories = getData("categories");
  var used = getData("products").filter(function (p) { return p.category == categories[index]; });
  if (used.length > 0) {
    alert("You can't delete this category, it has " + used.length + " products");
    return;
  }
  if (!confirm("Delete " + categories[index] + "?")) return;
  categories.splice(index, 1);
  saveData("categories", categories);
  showCategories();
}

//Admin
function showAdmins() {
  var users = getData("users");
  var html = "";
  for (var i = 0; i < users.length; i++) {
    if (users[i].role == "admin") html += `<li>${users[i].name} - ${users[i].email}</li>`;
  }
  el("adminsList").innerHTML = html;
}

el("addAdminBtn").addEventListener("click", function () {
  var name = el("adminName").value.trim();
  var email = el("adminEmail").value.trim();
  var password = el("adminPassword").value;

  if (!validateUser("admin", name, email, password, el("adminConfirm").value)) return;

  var users = getData("users");
  users.push({ name: name, email: email, password: password, role: "admin" });
  saveData("users", users);
  clearInputs(["adminName", "adminEmail", "adminPassword", "adminConfirm"]);
  alert("Admin added");
  showAdmins();
});

//Start
if (user == null) showPage("login");
else if (user.role == "admin") showPage("admin");
else showPage("shop");