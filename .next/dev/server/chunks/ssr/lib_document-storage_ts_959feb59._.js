module.exports = [
"[project]/lib/document-storage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearDocuments",
    ()=>clearDocuments,
    "getAllDocuments",
    ()=>getAllDocuments,
    "getDocument",
    ()=>getDocument,
    "removeDocument",
    ()=>removeDocument,
    "saveDocument",
    ()=>saveDocument
]);
const DB_NAME = "cbi-documents";
const STORE_NAME = "documents";
const DB_VERSION = 1;
function openDB() {
    return new Promise((resolve, reject)=>{
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = ()=>{
            request.result.createObjectStore(STORE_NAME);
        };
        request.onsuccess = ()=>resolve(request.result);
        request.onerror = ()=>reject(request.error);
    });
}
async function saveDocument(key, doc) {
    const db = await openDB();
    return new Promise((resolve, reject)=>{
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(doc, key);
        tx.oncomplete = ()=>{
            db.close();
            resolve();
        };
        tx.onerror = ()=>{
            db.close();
            reject(tx.error);
        };
    });
}
async function getDocument(key) {
    const db = await openDB();
    return new Promise((resolve, reject)=>{
        const tx = db.transaction(STORE_NAME, "readonly");
        const request = tx.objectStore(STORE_NAME).get(key);
        request.onsuccess = ()=>{
            db.close();
            resolve(request.result ?? null);
        };
        request.onerror = ()=>{
            db.close();
            reject(request.error);
        };
    });
}
async function removeDocument(key) {
    const db = await openDB();
    return new Promise((resolve, reject)=>{
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = ()=>{
            db.close();
            resolve();
        };
        tx.onerror = ()=>{
            db.close();
            reject(tx.error);
        };
    });
}
async function getAllDocuments() {
    const db = await openDB();
    return new Promise((resolve, reject)=>{
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const result = {};
        const request = store.openCursor();
        request.onsuccess = ()=>{
            const cursor = request.result;
            if (cursor) {
                result[cursor.key] = cursor.value;
                cursor.continue();
            } else {
                db.close();
                resolve(result);
            }
        };
        request.onerror = ()=>{
            db.close();
            reject(request.error);
        };
    });
}
async function clearDocuments() {
    const db = await openDB();
    return new Promise((resolve, reject)=>{
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).clear();
        tx.oncomplete = ()=>{
            db.close();
            resolve();
        };
        tx.onerror = ()=>{
            db.close();
            reject(tx.error);
        };
    });
}
}),
];

//# sourceMappingURL=lib_document-storage_ts_959feb59._.js.map