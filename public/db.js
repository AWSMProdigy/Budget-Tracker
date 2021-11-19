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

  function checkDatabase() {
    const transaction = db.transaction(["BudgetDB"], "readwrite");
    const BudgetStore = transaction.objectStore("BudgetDB");
    var request = BudgetStore.getAll();
    return request;
  
    // open a transaction on your pending db
    // access your pending object store
    // get all records from store and set to a variable
  
    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch('/api/transaction/bulk', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then(() => {
            const transaction = db.transaction(["BudgetDB"], "readwrite");
            const BudgetStore = transaction.objectStore("BudgetDB");
            var request = BudgetStore.clear();
            // if successful, open a transaction on your pending db
            // access your pending object store
            // clear all items in your store
          });
      }
    };
  }
  
  // listen for app coming back online
  window.addEventListener('online', checkDatabase);