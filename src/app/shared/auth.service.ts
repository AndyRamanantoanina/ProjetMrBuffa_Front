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
    const data = this.http.post(this.myurl + "api/login", login);
    return data;
  }

  setToken(token:string) {
    localStorage.setItem('access_token', token);
  }

  setUtilisateur(utilisateur:any) {
    localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
  }

  isAdmin() {
    let isUserAdmin = JSON.parse(localStorage.getItem('utilisateur') || '{}');
    return isUserAdmin.isAdmin;
  }

  getToken():any {
    return localStorage.getItem("access_token");
  }

  isLoggedIn() {
    return this.getToken() != null;
  }
}