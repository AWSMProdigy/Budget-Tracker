let db;
let version;

//Open our BudgetDB indexed database
const openedIndex = indexedDB.open('BudgetDB', version || 21);

openedIndex.onupgradeneeded = function (e) {
  console.log('Upgrade needed in IndexDB');

  const { old } = e;
  const updated = e.updated || db.version;

  console.log(`DB Updated from version ${old} to ${updated}`);

  db = e.target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore('BudgetStore', { autoIncrement: true });
  }
};

openedIndex.onerror = function (e) {
  console.log(`Woops! ${e.target.errorCode}`);
};

//Check database when going online
function checkDatabase() {
  console.log('check db invoked');
  //Get transaction and objectStore

  let transaction = db.transaction(['BudgetStore'], 'readwrite');

  const store = transaction.objectStore('BudgetStore');

  const getStore = store.getAll();

  //Get all values from store
  getStore.onsuccess = function () {
    if (getStore.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getStore.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.length !== 0) {
            transaction = db.transaction(['BudgetStore'], 'readwrite');

            const currentStore = transaction.objectStore('BudgetStore');

            currentStore.clear();
            console.log('Clearing store 🧹');
          }
        });
    }
  };
}


//Log success and get db
openedIndex.onsuccess = function (e) {
  console.log('success');
  db = e.target.result;

  if (navigator.onLine) {
    console.log('Backend online! 🗄️');
    checkDatabase();
  }
};

//Save record to store to use when offline
const saveRecord = (record) => {
  console.log('Save record invoked');
  const transaction = db.transaction(['BudgetStore'], 'readwrite');

  const store = transaction.objectStore('BudgetStore');

  store.add(record);
};

//Listen to the browser coming back online
window.addEventListener('online', checkDatabase);
