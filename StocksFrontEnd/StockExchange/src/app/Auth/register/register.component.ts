import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { NotificationService } from '../../Notification/notification.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  RegisterFormgroup : FormGroup;

  constructor (private formbuilder: FormBuilder  , private auth :AuthServiceService,private  notify : NotificationService) {

    this.RegisterFormgroup = this.formbuilder.group({
      username: '',
      password: '',
      confirmpassword: '',
    })    
  }

  register() : void { 

    const username = this.RegisterFormgroup.value.username;
    const password = this.RegisterFormgroup.value.password;
    const confirmP = this.RegisterFormgroup.value.confirmpassword;

    if (password !== confirmP){
      this.notify.showSuccess("Password and Confirm Password Does Not Match");
      return;
    }

    if (password === '' || confirmP === '' || username === ''){
      this.notify.showSuccess("Password fill the spaces");
      return;
    }

    this.auth.Register(username,password).subscribe ();
  }
}
