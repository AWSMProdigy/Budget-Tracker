let db;
const request = window.indexedDB.open("BudgetDB", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  const BudgetStore = db.createObjectStore("BudgetDB", {
    autoIncrement: true
  });
  BudgetStore.createIndex("statusIndex", "status");
};

request.onsuccess = function (event) {
    db = event.target.result;
  
    if (navigator.onLine) {
      checkDatabase();
    }
  };

  request.onerror = function (event) {
    // log error here
    console.log(event.error);
  };
  
  function saveRecord(record) {
    const transaction = db.transaction(["BudgetDB"], "readwrite");
    const BudgetStore = transaction.objectStore("BudgetDB");
    BudgetStore.add({ listID: "1", status: "complete" });
    // create a transaction on the pending db with readwrite access
    // access your pending object store
    // add record to your store with add method.
  }