import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from 'src/models/contact.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  //standalone: true,
  //imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  http = inject(HttpClient);

  contactsForm = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string | null>(null),
    phone: new FormControl<string>(''),
    favorite: new FormControl<boolean>(false)
  })

  contacts$ = this.getContacts();

  onFormSubmit() {
    const addContactRequest = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phone: this.contactsForm.value.phone,
      favorite: this.contactsForm.value.favorite
    }

    this.http.post('https://localhost:7072/api/Contact',addContactRequest)
    .subscribe({
      next: (value) => {
        console.log(value);
        this.contacts$ = this.getContacts();
        this.contactsForm.reset();
      }
    });
  }

  onDelete(id: string) {
    this.http.delete(`https://localhost:7072/api/Contact/${id}`)
    .subscribe({
      next: (value) => {
        alert('Item deleted');
        this.contacts$ = this.getContacts();
      }
    })
  }

  private getContacts(): Observable<Contact[]>  {
    return this.http.get<Contact[]>('https://localhost:7072/api/Contact');
  }
}


