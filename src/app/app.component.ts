import { Component } from '@angular/core';
import { IdbService } from './idb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rawidb';

  constructor(private idbs: IdbService) {
    this.idbs.syncDb().then( _ => {
      const jsonData = {
        key: 'id003',
        name: 'Outro camarada',
        age: 45,
        email: 'outro@isso.com'
      };
      // OK!
      // this.idbs.create(jsonData, 'clients'). then(e => console.log(e, 'criado?'), er => console.log(er));
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
        this.idbs.delete('clients', 'id003').then(o => console.log(o), err => console.error(err));
    });

    // NOT OK OUTSIDE!
    // this.idbs.readObject('clients', 'id003').then(o => console.log(o));
  }

  // ---------------------------------------------------------------------------

  ngOnInit(): void {
    // this.idbs.syncDb().then( _ => 
    // );
  }

}
