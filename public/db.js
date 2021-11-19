let db;
const request = window.indexedDB.open("BudgetDB", 1);
// create a new db request for a "BudgetDB" database.

request.onupgradeneeded = function (event) {
  // create object store called "BudgetStore" and set autoIncrement to true
  db = event.target.result;
  const BudgetStore = db.createObjectStore("BudgetDB", {
    autoIncrement: true
  });
  BudgetStore.createIndex("statusIndex", "status");
};