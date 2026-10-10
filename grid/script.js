alert("Welcome to my first site");

function exchangeEgyPound(pounds) {
  return Number((pounds * 0.03235).toFixed(1));
}

console.log(exchangeEgyPound(2000)); 
console.log(exchangeEgyPound(340));  

var firstName = prompt("Enter your first name:");
while (firstName === null || !/^[A-Za-z\u0600-\u06FF]+$/.test(firstName.trim())) {
  firstName = prompt("Invalid! First name must be letters only. Enter your first name:");
}
firstName = firstName.trim();

var birthYear = prompt("Enter your birth year:");
while (birthYear === null || !/^(190[1-9]|19[1-9]\d|[2-9]\d{3})$/.test(birthYear.trim())) {
  birthYear = prompt("Invalid! Birth year must be a number greater than 1900:");
}
birthYear = Number(birthYear);

var mobile = prompt("Enter your mobile number:");
while (mobile === null || !/^\d{11}$/.test(mobile.trim())) {
  mobile = prompt("Invalid! Mobile must be exactly 11 digits:");
}
mobile = mobile.trim();

var color = prompt("Choose a color (red, green or blue):");
while (color === null || !/^(red|green|blue)$/i.test(color.trim())) {
  color = prompt("Invalid! Choose red, green or blue:");
}
color = color.trim().toLowerCase();

function equalFunc(a, b, c) {
  if (a === b && b === c) {
    return 3;
  } else if (a === b || b === c || a === c) {
    return 2;
  }
  return 0;
}

console.log(equalFunc(3, 4, 3)); 
console.log(equalFunc(1, 1, 1)); 
console.log(equalFunc(3, 4, 1));


var sum = 0;
var value;

do {
  value = prompt("Enter a number (0 to stop). Current sum: " + sum);

  if (value === null) {
    break;
  }

  if (value.trim() === "" || isNaN(value)) {
    alert("Please enter a numeric value only!");
    value = NaN;
    continue;
  }

  value = Number(value);
  sum += value;
} while (value !== 0 && sum <= 50);

alert("Total sum = " + sum);