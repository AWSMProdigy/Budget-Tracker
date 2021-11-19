let db;
const request = window.indexedDB.open("BudgetDB", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  const BudgetStore = db.createObjectStore("BudgetDB", {
    autoIncrement: true
  });
  BudgetStore.createIndex("statusIndex", "status");
};