import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdbService {

  private readonly dbname = 'TEST_DB4';
  private idbOpenRequest: IDBOpenDBRequest;
  private db: IDBDatabase;

  constructor() { }

  syncDb(): Promise<string> {

    return new Promise((resolve, reject) => {
      this.idbOpenRequest = indexedDB.open(this.dbname, 1);

      // Ao criar/atualizar com sucesso:
      this.idbOpenRequest.onsuccess = event => {
        // console.log('request.onsuccess: ' + event.target.toString());

        this.db = this.idbOpenRequest.result;
        this.db.onversionchange = evt => resolve('version changed');
        // this.db.oncomplete = evt => resolve('db completed');

        this.db.onerror = evt => console.error(evt.target);

        resolve('success open request');
      };

      // Ao ser atualizado:
      this.idbOpenRequest.onupgradeneeded = event => {
        // resolve('request.onupgradeneeded: ' + this.idbOpenRequest.toString());

        this.db = this.idbOpenRequest.result;

        // Create tables:
        const tables = ['clients', 'products'];

        // Cria um objectStore para conter a informação sobre nossos clientes. Nós vamos
        // usar "ssn" como key path porque sabemos que é único;
        const objectStore = this.db.createObjectStore(tables[0], { keyPath: 'key' });

        // Cria um índice para buscar clientes pelo nome. Podemos ter nomes
        // duplicados, então não podemos usar como índice único.
        objectStore.createIndex('name', 'name', { unique: false });

        // Cria um índice para buscar clientes por email. Queremos ter certeza
        // que não teremos 2 clientes com o mesmo e-mail;
        // objectStore.createIndex("email", "email", { unique: true });

        // Usando transação oncomplete para afirmar que a criação do objectStore 
        // é terminada antes de adicionar algum dado nele.
        objectStore.transaction.oncomplete = _ => resolve('tables created');

        // End create tables.

        this.db = this.idbOpenRequest.result;
        // this.db.oncomplete = evt => console.log(this.db.toString());
        this.db.onerror = evt => console.error(evt.target);
      };

      // Erro ao criar/atualizar:
      this.idbOpenRequest.onerror = evt => reject('Problemas ao criar/atualizar: ' + evt.target);
    });
  }

  count(table: string): Promise<number> {
    return new Promise((resolve, reject) => {

      // create transaction from database
      const transaction = this.db.transaction(table, 'readonly');

      // get store from transaction
      // returns IDBObjectStore instance
      const store = transaction.objectStore(table);

      // count number of objects in store
      const count = store.count();

      count.onsuccess = evt => resolve(count.result);
      count.onerror = evt => reject(count.error);
    });
  }

    create(jsonData, table: string): Promise<string> {
    return new Promise((resolve, reject) => {
// console.log('erro?');
      // Armazenando valores no novo objectStore.
      const store = this.db.transaction(table, 'readwrite').objectStore(table);
      const obj = store.add(jsonData);
      obj.onsuccess = evt => resolve(obj.toString());
      obj.onerror = evt => reject(obj.error);

    });
  }

  readObject(table: string, key: string): Promise<{} | 'not found'> {
    return new Promise(async (resolve, reject) => {
      const db = this.idbOpenRequest.result;
      const transaction = db.transaction(table, 'readonly');
      const store = transaction.objectStore(table);
      const request = store.get(key);
      request.onsuccess = evt => resolve(request.result ? request.result : 'not found');
      request.onerror = evt => reject(request.error);
    });
  }

  readList(table: string, options?: any,
    sortOptions?: { key: string, type: 'asc' | 'desc' }): Promise<{}[]> {
    return new Promise((resolve, reject) => {

      const transaction = this.db.transaction(table, 'readonly');
      const store = transaction.objectStore(table);
      const list = store.getAll();
      list.onsuccess = evt => resolve(list.result);
      list.onerror = evt => reject(`Table ${table} exists? ${list.error}`);
    });
  }

  update(jsonData, table: string, key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(table, 'readwrite');

      const store = transaction.objectStore(table);
      const getRequest = store.get(key);

      // this.db.setDefaultErrorHandler(getRequest);

      getRequest.onsuccess = e => {

        const foundRecord = getRequest.result;

        if (foundRecord !== undefined) {

          const putRequest = store.put(jsonData);

          // this.db.setDefaultErrorHandler(putRequest);

          putRequest.onsuccess = evt => resolve(true);
          putRequest.onerror = evt => reject(putRequest.error);

        } else {
          reject(`Não existe o registro ${key} na tabela ${table}.`);
        }
      };
    });
  }

  delete(table: string, key: string, moveToDeletedItems?: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(table, 'readwrite');

      const store = transaction.objectStore(table);
      const deleteRequest = store.delete(key);

      // db.setDefaultErrorHandler(deleteRequest);

      // FUNCIONANDO, PORÉM NÃO DÁ PRA SABER SE REALMENTE APAGOU OU SE NÃO ACHOU:
      deleteRequest.onsuccess = evt => resolve(true);
      deleteRequest.onerror = evt => reject(deleteRequest.error);
    });
  }
}
