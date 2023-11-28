const line = document.querySelector(".line");

let inputs = [0,1,1,2,3,4,5];

function displayInputs() {
  inputs.forEach(function(input) {
    var aTag = document.createElement("a");
    aTag.textContent = input;
    line.appendChild(aTag);
  });
}

document.getElementById("test").addEventListener("click", function() {
  var line = document.querySelector(".line");
  var currentPosition = window.getComputedStyle(line).getPropertyValue("left");
  console.log(currentPosition);
  currentPosition = parseInt(currentPosition) || 0;
  line.style.left = (currentPosition - 40) + "px";
  
  displayInputs();
});

displayInputs();

