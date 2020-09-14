import { Component } from '@angular/core';
import { IdbService } from './idb.service';

interface Client {
  key: string;
  name: string;
  age: number;
  email: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rawidb';

  clients: Promise<{}[]>;
  currentClient = { key: '', name: '', age: 0, email: ''};

  constructor(private idbs: IdbService) {

    this.idbs.syncDb().then( _ => {
      const jsonData = {
        key: 'id012',
        name: 'André Teixeira Sodré',
        age: 23,
        email: 'dedea@isso.com'
      };
      this.clients = this.idbs.readList('clients');
      // OK!
      this.idbs.create(jsonData, 'clients'). then(e => console.log(e, 'criado?'), er => console.log(er));
      // OK!
      // this.idbs.readObject('clients', 'id0039').then(o => console.log(o), err => console.error(err));
      // OK!
      // this.idbs.readList('clients').then(o => console.log(o), err => console.log(err));
      // OK!
      // this.idbs.update({
        //   key: 'id003',
        //   name: 'Outro camarada atualizado!',
        //   age: 45,
        //   email: 'outro@isso.com'
        // }, 'clients', 'id003').then(o => console.log(o), err => console.log(err));
        // this.idbs.delete('clients', 'id003').then(o => console.log(o), err => console.error(err));
    });

    // NOT OK OUTSIDE!
    // this.idbs.readObject('clients', 'id003').then(o => console.log(o));
  }

  // ---------------------------------------------------------------------------

  ngOnInit(): void {
    // this.idbs.syncDb().then( _ => 
    // );
  }

  openAdd() {
    this.currentClient.key = '';
    this.currentClient.name = '';
    this.currentClient.age = 0;
    this.currentClient.email = '';
  }

  add() {
    if(this.currentClient.key === ''
    && this.currentClient.name.length > 5
    && this.currentClient.email.length > 5) {
      this.currentClient.key = 'id0' + (Math.floor(Math.random() * (100) + 14)).toString();
      this.idbs.create(this.currentClient, 'clients').then(_ => {
        this.clients = this.idbs.readList('clients');
        this.openAdd(); // Limpa o form.
        document.getElementById('formdiv').hidden = true;
      });
    }
    else if(this.currentClient.key.length > 4
    && this.currentClient.name.length > 5
    && this.currentClient.email.length > 5){
      this.idbs.update(this.currentClient, 'clients', this.currentClient.key).then(_ => {
        this.clients = this.idbs.readList('clients');
        this.openAdd(); // Limpa o form.
        document.getElementById('formdiv').hidden = true;
      });
    }
    else {
      alert('Dados inválidos no form');
    }
  }

  edit(key: string) {
    this.idbs.readObject('clients', key).then((obj: Client) => {
      this.currentClient.key = obj.key;
      this.currentClient.name = obj.name;
      this.currentClient.age = obj.age;
      this.currentClient.email = obj.email;
    });
  }

  delete(key: string) {
    alert('Altera cliente ' + key);
  }
}
