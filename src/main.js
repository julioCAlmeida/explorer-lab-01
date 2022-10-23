import "./css/index.css";
import IMask from "imask";

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setTypeCard(type) {
  const colors = {
    visa: ["#436d99", "#2d57f2"],
    mastercard: ["#df6f29", "#c69347"],
    default: ["black", "grey"]
  }

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`)
};

globalThis.setTypeCard = setTypeCard;

// security Code
const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "0000"
};
const securityCodeMask = IMask(securityCode, securityCodePattern);

// experation date
const experationDate = document.querySelector("#expiration-date");
const experationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    }
  }
};
const experationDateMask = IMask(experationDate, experationDatePattern);

// card number
const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex:/^4\d{0,15}/,
      cardType: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex:/^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2}\d{0,12}/,
      cardType: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default"
    }
  ],
  dispatch: function(appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(item => number.match(item.regex))

    return foundMask
  },
}
const cardNumberMask = IMask(cardNumber, cardNumberPattern);

//add um evento de click no botao adicionar cartao
const addButton = document.querySelector("#add-card");
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
});

//update do nome do titular
const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");
  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
});

//update do codigo de seguranca do cartao
securityCodeMask.on("accept", () => {
  updateSecurityCode(securityCodeMask.value)
});

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
};

//update da expiracao do cartao
experationDateMask.on("accept", () => {
  updateExperationMask(experationDate.value)
});

function updateExperationMask(date) {
  const ccExtra = document.querySelector(".cc-extra .value");
  ccExtra.innerText = date.length === 0 ? "02/32" : date
};

//update do numero do cartao
cardNumberMask.on("accept", () => {
  const cardType = cardNumberMask.masked.currentMask.cardType
  setTypeCard(cardType);
  updateCardNumberMask(cardNumberMask.value);
});

function updateCardNumberMask(number) {
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}