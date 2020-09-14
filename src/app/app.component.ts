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

    // Colocar esse sync interno às operações?
    // As operações sequentes já estão funcionando sem invocar o sync!
    this.idbs.syncDb().then( _ => this.clients = this.idbs.readList('clients'));

    // NOT OK OUTSIDE!
    // this.idbs.readObject('clients', 'id003').then(o => console.log(o));
  }

  // ---------------------------------------------------------------------------

  openAdd(): void {
    this.currentClient.key = '';
    this.currentClient.name = '';
    this.currentClient.age = 0;
    this.currentClient.email = '';
  }

  add(): void {
    if(this.currentClient.key === ''
    && this.currentClient.name.length > 5
    && this.currentClient.email.length > 5) {
      this.currentClient.key = 'id0' + (Math.floor(Math.random() * (100) + 14)).toString();
      this.idbs.create(this.currentClient, 'clients').then(_ => {
        this.clients = this.idbs.readList('clients');
        this.openAdd(); // Limpa o form.
        document.getElementById('formdiv').hidden = true;
      },
      err => alert(err));
    }
    else if(this.currentClient.key.length > 4
    && this.currentClient.name.length > 5
    && this.currentClient.email.length > 5){
      this.idbs.update(this.currentClient, 'clients', this.currentClient.key).then(_ => {
        this.clients = this.idbs.readList('clients');
        this.openAdd(); // Limpa o form.
        document.getElementById('formdiv').hidden = true;
      },
      err => alert(err));
    }
    else {
      alert('Dados inválidos no form');
    }
  }

  edit(key: string): void {
    this.idbs.readObject('clients', key).then((obj: Client) => {
      this.currentClient.key = obj.key;
      this.currentClient.name = obj.name;
      this.currentClient.age = obj.age;
      this.currentClient.email = obj.email;
    });
  }

  delete(key: string): void {
    this.idbs.delete('clients', key);
    this.clients = this.idbs.readList('clients');
    document.getElementById('formdiv').hidden = true;
  }
}
