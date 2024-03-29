"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data:
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
  movements: [
    { date: "2022-01-01", value: 200 },
    { date: "2022-04-03", value: -200 },
    { date: "2022-10-01", value: 340 },
    { date: "2021-06-06", value: -300 },
    { date: "2019-03-28", value: -20 },
    { date: "2022-01-06", value: 50 },
    { date: "2020-12-25", value: 400 },
    { date: "2022-11-01", value: -460 },
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Javier Rodríguez",
  movements: [
    { date: "2022-01-09", value: 430 },
    { date: "2019-09-22", value: 1000 },
    { date: "2023-01-21", value: 700 },
    { date: "2021-11-21", value: 50 },
    { date: "2022-10-17", value: 90 },
  ],
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

const createBalance = function () {
  accounts.forEach((account) => {
    account.balance = account.movements.reduce(
      (acc, { value }) => acc + value,
      0
    );
  });
};

// Elements:
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

let session = false;
let activeAccount = {};
let sort = true;
let intervalID;
const timeLimit = 60 * 5;

console.log(accounts);
createUsernames();
createBalance();

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);

  if (session == true) {
    if (confirm(`¿Quieres cerrar sesión?`) == true) {
      alert(`Gracias por su visita`);
      logout();
    }
  } else {
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
    } `;

    // Limpiar datos:
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    activeAccount = currentAccount;
    inputTransferAmount.value = "";
    inputTransferTo.value = "";
    inputLoanAmount.value = "";
    inputCloseUsername.value = "";
    inputClosePin.value = "";
    session = true;

    // Mostrar datos:
    updateUI(currentAccount);

    // Mostrar operaciones más recientes:
    sortDates(currentAccount);

    // Inicir contador:
    startTimer(timeLimit);

    } else {
    console.log(`Login incorrecto.`);
    }
  }
});

const updateUI = (currentAccount) => {
  // Obtener movimientos:
  const { movements } = currentAccount;
  console.log(`Movimientos: `, movements);

  // Mostrar movimientos:
  displayMovements(currentAccount);

  // Mostrar balance:
  calcAndDisplayBalance(currentAccount.movements, currentAccount);

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

const calcAndDisplayBalance = (movements, currentAccount) => {
  const balance = movements.reduce((acc, { value }) => acc + value, 0);
  labelBalance.textContent = `${balance.toFixed(2)} €`;
  currentAccount["balance"] = balance;
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

// Ordenar fechas:
const sortDates = () => {
  const { movements } = activeAccount;

  if (sort) {
    movements.sort(function compare(a, b) {
      var dateA = new Date(a.date);
      var dateB = new Date(b.date);
      sort = false;
      return dateA - dateB;
    });
  } else {
    movements.sort(function compare(a, b) {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      sort = true;
      return dateB - dateA;
    });
  }

  displayMovements(activeAccount);
};

btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  sortDates();
});

// Hacer transferencias:
const transfer = function () {
  const ammount = Number(inputTransferAmount.value);
  console.log(`ammount = ${ammount}`);
  const accountName = inputTransferTo.value;
  console.log(accountName);
  const currentBalance = activeAccount.balance;
  console.log(`balance = ${currentBalance}`);

  const targetAccount = accounts.find(
    (account) => account.username === accountName
  );

  console.log(`targetAccount= ${targetAccount}`);
  if (!targetAccount) {
    alert("No se encuentra la cuenta de destino");
  } else if (accountName === activeAccount.username) {
    alert("Una cuenta no puede transferirse dinero a sí misma");
  } else if (ammount <= 0) {
    alert("La cantidad de la  transferencia debe ser mayor que 0");
  } else if (ammount > currentBalance) {
    alert("No se dispone de la cantidad especificada");
  } else {
    executeTransfer(targetAccount, ammount);
  }
};

const executeTransfer = function (targetAccount, ammount) {
  const currentDate = new Date().toJSON().slice(0, 10);

  activeAccount.movements.push({
    date: `${currentDate}`,
    value: ammount * -1,
  });

  targetAccount.movements.push({
    date: `${currentDate}`,
    value: ammount,
  });
};

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  transfer();
  updateUI(activeAccount);
  inputTransferAmount.value = "";
  inputTransferTo.value = "";
});

// Petición de préstamos:
const Loan = function () {
  const ammount = Number(inputLoanAmount.value);
  const allowedAmmount = activeAccount.balance * 0.3;
  const { hasLoan } = activeAccount;
  console.log(allowedAmmount);

  if (hasLoan == true) {
    alert(`No puede pedir más de un préstamo a la vez`);
  } else if (ammount <= 0) {
    alert(`El préstamo debe ser mayor que 0`);
  } else if (ammount > allowedAmmount) {
    alert(
      `Esta cuenta no está autorizada a préstamos mayores de ${allowedAmmount} €`
    );
  } else {
    executeLoan(ammount);
  }
};

const executeLoan = function (ammount) {
  const currentDate = new Date().toJSON().slice(0, 10);
  activeAccount.movements.push({
    date: `${currentDate}`,
    value: ammount,
  });
  activeAccount.hasLoan = true;
};

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  Loan();
  updateUI(activeAccount);
  inputLoanAmount.value = "";
});

// Cerrar sesión:
const logout = function () {
  labelWelcome.textContent = `Log in to get started`;
  containerApp.style.opacity = 0;
  activeAccount = null;
  session = false;
  clearInterval(intervalID);
};

// Cerrar cuenta:
const closeAccount = function () {
  const usernameClose = inputCloseUsername.value;
  console.log(`Close: ${usernameClose}`);
  const pinClose = Number(inputClosePin.value);
  console.log(`Close: ${pinClose}`);

  if (
    activeAccount.username === usernameClose &&
    activeAccount.pin === pinClose
  ) {
    console.log(`Login close correcto.`);
    // console.log(activeAccount);

    if (confirm(`¿Quieres cancelar la cuenta?`) == true) {
      const activeAccountIndex = accounts.findIndex(
        (account) =>
          account.username === usernameClose && account.pin === pinClose
      );

      console.log(`Index de cuenta activa: `, activeAccountIndex);
      accounts.splice(activeAccountIndex, 1);
      console.log(accounts);
      alert(`Cuenta eliminada`);
      logout();
    } else {
      alert(`Operación cancelada`);
      inputCloseUsername.value = "";
      inputClosePin.value = "";
      console.log(accounts);
    }
  } else {
    alert(`Datos incorrectos.`);
    inputCloseUsername.value = "";
    inputClosePin.value = "";
  }
};

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  closeAccount();
});

// Contador de sesión:
const startTimer = function (duration) {
  let timer = duration, minutes, seconds;
  intervalID = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    labelTimer.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      timer = duration;
    }

    if (minutes == 0 && seconds == 0) {
      alert(`La sesión ha caducado`);
      logout();
    }
  }, 1000);
}