const balance = document.getElementById("balance");
const money_plus =  document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const localStorageTransactions = JSON.parse(localStorage.getItem('Transactions'));

let Transactions = localStorage.getItem('Transactions') !== null ? localStorageTransactions : [];

let removedTransactions = [];




// Add transaction
function addTransaction(e){
    e.preventDefault();
    if(text.value.trim() === '' || amount.value.trim() ==='')
    {
        alert("Please Enter Text and value");
    }
    else{
        const transaction ={
            id:generateId(),
            text: text.value,
            amount :+amount.value,
        }
        Transactions.push(transaction);
        addTransactionDOM(transaction);
        updateLocalStorage();
        updateValues();
        text.value = '';
        amount.value = '';
    }
}

// redo transaction

function redoTransaction() {
    if (removedTransactions.length > 0) {
        const lastRemovedTransaction = removedTransactions.pop(); // Get the last removed transaction
        Transactions.push(lastRemovedTransaction); // Add it back to the Transactions array
        addTransactionDOM(lastRemovedTransaction); // Re-render it in the DOM
        updateLocalStorage();
        updateValues();
    } else {
        alert("No transactions to redo.");
    }
}


// GenerateId

function generateId(){
    return Math.floor(Math.random()*1000000000);
}


// Add to dom

function addTransactionDOM(transaction){
    const sign = transaction.amount < 0? "-":"+" ;
    const item = document.createElement("li");
    item.classList.add(transaction.amount <0 ?"minus": "plus");
    item.innerHTML = `${transaction.text}<span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
    `;

    list.appendChild(item);
    
}


// remove transaction

function removeTransaction(id){
    const transactionToRemove = Transactions.find(transaction => transaction.id === id);
    removedTransactions.push(transactionToRemove); 
    Transactions = Transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    Init();
}


// Update Value

function updateValues(){
    const amounts = Transactions.map((transaction=>transaction.amount));
    const total = amounts.reduce((acc,item) =>(acc += item),0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc,item) => (acc+=item),0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc,item) => (acc+=item),0)* -1).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}


// Update Local Storage
function updateLocalStorage(){
    localStorage.setItem('Transactions',JSON.stringify(Transactions));
  }

// INIT APP

function Init(){
    list.innerHTML="";
    Transactions.forEach(addTransactionDOM);
    updateValues();
}
// addTransactionDOM(Transactions);
Init();
document.getElementById("redo-btn").addEventListener("click", redoTransaction);

form.addEventListener("submit",addTransaction);