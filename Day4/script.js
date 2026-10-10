var container = document.getElementById("products");

var xhr = new XMLHttpRequest();

xhr.open("GET", "https://fakestoreapi.com/products");
xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
        var products = JSON.parse(xhr.responseText);
        var html = "";
        for(var i = 0; i < products.length; i++){
            html += "<div class='product'>";
            html += "<img src='" + products[i].image + "' alt='" + products[i].title.replace(/'/g, "&#39;") + "'>";
            html += "<div class='product-body'>";
            html += "<h2>" + products[i].title + "</h2>";
            html += "<p class='description'>" + products[i].description + "</p>";
            html += "<p class='price'>$" + products[i].price + "</p>";
            html += "</div>";
            html += "</div>";
        }
    container.innerHTML = html;
    }
};
xhr.send();