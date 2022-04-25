import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  myurl: string = environment.myurl;
  constructor(
    private http: HttpClient,
  ) { }

  public login(login: any) {
    const data = this.http.post(this.myurl + "/utilisateur/login", login);
    return data;
  }

  setToken(token:string) {
    localStorage.setItem('access_token', token);
  }

  setUtilisateurAdmin(admin:boolean) {
    localStorage.setItem('isAdmin', JSON.stringify(admin));
  }

  isAdmin() {
    let isUserAdmin = JSON.parse(localStorage.getItem('isAdmin') || '{}');
    return isUserAdmin;
  }

  getToken():any {
    return localStorage.getItem("access_token");
  }

  isLoggedIn() {
    return this.getToken() != null;
  }
}