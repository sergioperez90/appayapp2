import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  contactForm: FormGroup;
  constructor(public navCtrl: NavController,public formBuilder: FormBuilder) {
    this.contactForm = formBuilder.group({
        name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'), Validators.required])],
        text: ['', Validators.compose([Validators.required])]
    });
  }
  save(){
    if(this.contactForm.valid){
      console.log("success!")
      console.log(this.contactForm.value);
    }
  }

}
