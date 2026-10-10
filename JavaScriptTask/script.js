document.getElementById("dateBtn").addEventListener("click", () => {
  document.getElementById("dateTime").textContent = new Date().toLocaleString();
});

var adWindow = null;
var adContent =
  "<h1>Big Sale Today!</h1>" +
  "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor " +
  "incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud " +
  "exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>" +
  "<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu " +
  "fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa " +
  "qui officia deserunt mollit anim id est laborum.</p>" +
  "<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium " +
  "doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis " +
  "et quasi architecto beatae vitae dicta sunt explicabo.</p>";

document.getElementById("openAdBtn").addEventListener("click", () => {
  setTimeout(() => {
    adWindow = window.open("", "ad", "width=500,height=400");
    adWindow.document.write(adContent);
  }, 3000);
});

document.getElementById("closeAdBtn").addEventListener("click", () => {
  if (adWindow) {
    adWindow.close();
  }
});

var evenRegex = /^\d*[02468]$/;

console.log(evenRegex.test("2341"));
console.log(evenRegex.test("132"));
console.log(evenRegex.test("29"));
console.log(evenRegex.test("5578"));

var userName = prompt("Enter your name:");
while (userName === null || !/^[A-Za-z\u0600-\u06FF ]+$/.test(userName.trim())) {
  userName = prompt("Invalid! Name must be letters only. Enter your name:");
}
userName = userName.trim();

var phone = prompt("Enter your phone number (8 digits):");
while (phone === null || !/^\d{8}$/.test(phone.trim())) {
  phone = prompt("Invalid! Phone must be exactly 8 digits:");
}
phone = phone.trim();

var mobile = prompt("Enter your mobile number:");
while (mobile === null || !/^01[012]\d{8}$/.test(mobile.trim())) {
  mobile = prompt("Invalid! Mobile must be 11 digits and start with 010, 011 or 012:");
}
mobile = mobile.trim();

var email = prompt("Enter your email:");
while (email === null || !/^[A-Za-z0-9._-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/.test(email.trim())) {
  email = prompt("Invalid! Email must look like abc@123.com:");
}
email = email.trim();

var color = prompt("Choose a color (red, green or blue):");
while (color === null || !/^(red|green|blue)$/i.test(color.trim())) {
  color = prompt("Invalid! Choose red, green or blue:");
}
color = color.trim().toLowerCase();

var infoDiv = document.getElementById("info");
infoDiv.style.color = color;
infoDiv.innerHTML =
  "<h2>Welcome, " + userName + "!</h2>" +
  "<p>Today's date: " + new Date().toLocaleDateString() + "</p>" +
  "<p>Name: " + userName + "</p>" +
  "<p>Phone: " + phone + "</p>" +
  "<p>Mobile: " + mobile + "</p>" +
  "<p>Email: " + email + "</p>";