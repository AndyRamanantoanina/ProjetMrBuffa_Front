import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login!: string;
  motDePasse!: string;


  constructor(
    private router: Router,
    private auth: AuthService,
    private snackbar: MatSnackBar) {
    
   }

  ngOnInit(): void {
    if(this.auth.isLoggedIn()) {
      this.router.navigate(['./home']);
    } else {
      this.router.navigate(['/']);
    }
  }

  seConnecter() {
    const loginForm = {
      'pseudo': this.login,
      'mdp': this.motDePasse
    }
    console.log(loginForm);

    this.auth.login(loginForm).subscribe({
      next: response => {
        // @ts-ignore
        this.auth.setToken(response.token);
        // @ts-ignore
        this.auth.setUtilisateurAdmin(response.user.isAdmin);
        console.log(localStorage.getItem("isAdmin"));
        console.log(response);
        this.router.navigate(['./home']);
      },
      error: () => {
        var message = "Verifier votre login ou mot de passe";
        this.snackbar.open(message, '',  {
          duration : 2000,
          verticalPosition: 'top',
          panelClass: ['mat-toolbar', 'mat-primary']
        })
      }
    }) 
  }

  onSubmit() {
    this.seConnecter();
  }

}
