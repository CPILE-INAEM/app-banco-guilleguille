"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Juan Sánchez",
  movements: [
    { date: "2021-01-02", value: 200 },
    { date: "2021-01-21", value: -400 },
    { date: "2021-02-20", value: 450 },
    { date: "2021-03-19", value: 3000 },
    { date: "2021-04-12", value: -650 },
    { date: "2021-05-06", value: -130 },
    { date: "2021-01-03", value: 70 },
    { date: "2021-01-01", value: 1300 },
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "María Portazgo",
  movements: [
    { date: "2021-01-22", value: 5000 },
    { date: "2021-01-12", value: 3400 },
    { date: "2021-01-20", value: -150 },
    { date: "2021-06-12", value: -790 },
    { date: "2021-11-12", value: -3210 },
    { date: "2021-08-02", value: -1000 },
    { date: "2021-09-02", value: 8500 },
    { date: "2021-03-02", value: -30 },
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Estefanía Pueyo",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Javier Rodríguez",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// init data:
const createUsernames = function () {
  accounts.forEach((account) => {
    account.username = account.owner
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toLowerCase();
  });
};

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

console.log(accounts);
createUsernames();

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  console.log(`Intento de login con usuario ${username} y el pin ${pin}`);

  // Find:
  const currentAccount = accounts.find(
    (account) => account.username === username
  );

  // Puede ser null si el usuario no existe.

  console.log("Current account: ", currentAccount);

  // currentAccount && currentAccount.pin === currentAccount?.pin (ambas hacen lo mismo)

  if (currentAccount?.pin === pin) {
    console.log(`Login correcto.`);
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Bienvenido, usuario ${
      currentAccount.owner.split(" ")[0]
    } $message`;

    // Limpiar datos:
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Mostrar datos:
    updateUI(currentAccount);
  } else {
    console.log(`Login incorrecto.`);
  }
});

const updateUI = (currentAccount) => {
  // Obtener movimientos:
  // const movements = currentAccount.movements;

  // Mostrar movimientos:
  displayMovements(currentAccount);

  // Mostrar balance:
  calcAndDisplayBalance(currentAccount.movements);

  // Mostrar resumen:
  calcAndDisplaySummary(currentAccount);
};

const displayMovements = (currentAccount) => {
  // Limpar movimientos antiguos:
  // document.querySelector('.movements').innerHTML = '';

  // Insertarlos con insertAdjacentHTML:

  const { movements } = currentAccount;
  containerMovements.innerHTML = "";

  movements.forEach((mov, i) => {
    const { value } = mov;
    const { date } = mov;
    const type = value > 0 ? `deposit` : `withdrawal`;

    const movHTML = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } - ${type}</div>
          <div class="movements__date">${date}</div>
          <div class="movements__value">${value.toFixed(2)} €</div>
          </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", movHTML);
  });
};

const calcAndDisplayBalance = (movements) => {
  const balance = movements.reduce((acc, { value }) => acc + value, 0);
  labelBalance.textContent = `${balance.toFixed(2)} €`;
};

const calcAndDisplaySummary = (currentAccount) => {
  const { movements } = currentAccount;
  const incomes = movements
    .filter(({ value }) => value > 0)
    .reduce((acc, { value }) => acc + value, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)} €`;

  const out = movements
    .filter(({ value }) => value < 0)
    .reduce((acc, { value }) => acc + value, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)} €`;

  // Cálculo de intereses:
  // Teniendo en cuenta solo ingresos superiores a 100 €.
  // y que el interés de cada usuario es del 1,2 %
  // Y que los interes sean superiores a 2 €.

  const interest = movements
    .filter(({ value }) => value > 100)
    .map(({ value }) => (value * currentAccount.interestRate) / 100)
    .filter((int) => int >= 2)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
};

const transfer = function (currentAccount) {
  const ammount = Number(inputTransferAmount.textContent);
  const accountName = inputTransferTo.textContent;
  const currentBalance = labelBalance.textContent;
  const targetAccount = accounts.find(
    (account) => account.username === accountName
  );

  if (ammount <= 0) {
    alert("La cantidad de la  transferencia debe ser mayor que 0");
  } else if (!targetAccount) {
    alert("No se encuentra la cuenta de destino");
  } else if (ammount > currentBalance) {
    alert("No se dispone de la cantidad especificada");
  } else {
    executeTransfer(currentAccount, targetAccount, ammount);
  }
};

const executeTransfer = function (currentAccount, targetAccount, ammount) {
  const currentDate = new Date().toJSON().slice(0, 10);

  currentAccount.movements.push({
    date: `${currentDate}`,
    value: ammount * -1,
  });

  targetAccount.movements.push({
    date: `${currentDate}`,
    value: ammount,
  });
};

btnTransfer.addEventListener("click", transfer);
