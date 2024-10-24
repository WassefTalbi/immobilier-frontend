import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CountUpModule} from "ngx-countup";
import {UserProfileService} from "../../../core/services/user.service";
import {DomSanitizer} from "@angular/platform-browser";
import { User } from 'src/app/store/Authentication/auth.models';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, CountUpModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  users: any;
  breadCrumbItems!: Array<{}>;
  usersWithImages: any[] = [];

  constructor(private userService: UserProfileService,
              private sanitizer: DomSanitizer) { }

ngOnInit(): void {

  this.breadCrumbItems = [{ label: 'Custom UI' }, { label: 'Profile', active: true }];
  this.userService.getAllUsers().subscribe(data => {
    this.users = data;
    this.users.forEach((user: User) => {
      this.getImage(user);
    });
  });
}

  getImage(user: User) {
  if (user.photoProfile !== undefined) {
    this.userService.getImage(user.photoProfile).subscribe(data => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        // Add the image to the user object
        user.imageToShow = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
        this.usersWithImages.push(user);
      }, false);

      if (data) {
        reader.readAsDataURL(data);
      }
    }, error => {
      console.log(error);
    });
  } else {
    console.log('photoProfile is undefined for user:', user);
  }
}
  blockUser(id: number): void {
    console.log("aaaaa")
    this.userService.blockUser(id).subscribe((response) => {
      console.log(response)

      const user = this.users.find((user: any) => user.id === id);
      console.log(user.nonLocked)
      if (user) {
        user.nonLocked = false;
      }
    }, error => {
      // Log the error to the console
      console.error('Error unblocking user:', error);
    });
  }

  unblockUser(id: number): void {
    this.userService.unblockUser(id).subscribe((response) => {
      console.log(response)
      const user = this.users.find((user: any) => user.id === id);
      console.log(user.nonLocked)
      if (user) {
        user.nonLocked = true;
      }
    }, error => {
      // Log the error to the console
      console.error('Error unblocking user:', error);
    });
  }

}
