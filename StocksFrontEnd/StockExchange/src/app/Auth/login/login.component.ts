import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { NotificationService } from '../../Notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  loginFormgroup : FormGroup;

  constructor (private formbuilder: FormBuilder  , private auth :AuthServiceService,private  notify : NotificationService) {

    this.loginFormgroup = this.formbuilder.group({
      username: '',
      password: ''
    })    
  }

  login() : void { 

    const username = this.loginFormgroup.value.username;
    const password = this.loginFormgroup.value.password;

    if (password === '' || username === ''){
      this.notify.showSuccess("Password fill the spaces");
      return;
    }

    this.auth.login(username,password).subscribe ();
  }
}
