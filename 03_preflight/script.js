// alert()
document.body.style.background = "lightblue";

//О переменных
// JS - читает, меняет html

// умеет отлавливать действия в браузере

const title = document.querySelector("#title");
console.log(title);
title.textContent = "Новый текст";

const btn = document.querySelector("#btn");

btn.addEventListener("click", () => {
  alert("CLick!");
});
