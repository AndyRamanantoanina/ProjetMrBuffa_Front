import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit() {
  }
  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }
  public disconnect = () => {
    this.authService.destroyToken();
    this.sidenavClose.emit();
    this.router.navigate(['/']);
  }
}