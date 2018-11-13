import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../../common/models/user.models';
import { AuthService } from '../../common/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() sidenavToggle = new EventEmitter<boolean>();
  user: User;
  constructor(private authService: AuthService, private router: Router) {

    this.authService.userChange.subscribe((user: User) => {
      console.log(user);
      this.user = user;
    });
  }

  ngOnInit() {
  }

  onToggleSidenav() {
    // console.log('toogle');
    this.sidenavToggle.emit(true);
  }

  onLogOut() {
    this.authService.setLogginData(null);
    this.router.navigate(['/home']);
  }

}
