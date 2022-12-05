import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'; // Close dialog on success
import { FetchApiDataService } from '../fetch-api-data.service'; // API
import { MatSnackBar } from '@angular/material/snack-bar'; // Notifications
import { Router } from '@angular/router'; // Routing

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent implements OnInit {
  user: any = {};
  initialInput: any = {};
  @Input() updatedUser = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<ProfileViewComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  /**
   * Gets user data from api call and sets the user variable to returned JSON file
   */

  getUserInfo(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      console.log(this.user);
      this.updatedUser.Username = this.user.username;
      this.updatedUser.Email = this.user.email;
      this.updatedUser.Birthday = this.user.birthday;
      console.log(this.updatedUser);
      return this.user;
    });
  }

  /**
   * Update user's information
   */

  updateUserInfo(): void {
    this.fetchApiData.editUser(this.updatedUser).subscribe((result) => {
      console.log(result);
      this.snackBar.open('User profile successfully updated', 'OK', {
        duration: 2000,
      });
      if (this.user.username !== result.username) {
        localStorage.clear();
        this.router.navigate(['welcome']);
        this.snackBar.open(
          'User profile successfully updated. Please login using your new credentials',
          'OK',
          {
            duration: 2000,
          }
        );
      }
    });
  }

  /**
   * Deletes the user's account, redirects to welcome screen
   */

  deleteAccount(): void {
    if (confirm('Delete your account?')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('You have successfully deleted your account', 'OK', {
          duration: 2000,
        });
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }

  /**
   * Redirects to main movies pages
   */

  toMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * User logout and redirection to welcome page
   */

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}
