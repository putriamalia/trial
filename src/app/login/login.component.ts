import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public userStatus;

  constructor( private apiservice: ApiServiceService , private router: Router, private user: UserService) { }

  ngOnInit() {

  }

  loginUser(e) {
      e.preventDefault();
      const username = e.target.elements[0].value;
      const password = e.target.elements[1].value;

      if(username != null || password != null){
          this.setLocalStorage();
      }
      // this.getUser(username);
  }

  setLocalStorage(){
      this.user.setUserLoggedIn();
      this.router.navigate(['maps']);
  }

  getUser(username): void {
    this.apiservice.getUsername(username).subscribe(
      data => {
          const count = Object.keys(data).length;
          if (count > 0) {
            this.user.setUserLoggedIn();
            this.router.navigate(['maps']);
          } else {
            console.log('gagal');
          }
      },
      err => console.error(err)
    );
  }
}
