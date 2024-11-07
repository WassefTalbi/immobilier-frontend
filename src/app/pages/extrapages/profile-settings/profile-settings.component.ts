import { Component } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup ,Validators} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import {AuthenticationService} from "../../../core/services/auth.service";
import {UserProfileService} from "../../../core/services/user.service";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {GlobalComponent} from "../../../global-component";
import {DomSanitizer} from "@angular/platform-browser";
import { ToastrService } from 'ngx-toastr';
import { chatMessagesData } from '../../forms/advance/data';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})

// Profile Setting component
export class ProfileSettingsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  fieldTextType!: boolean;
  fieldTextType1!: boolean;
  fieldTextType2!: boolean;
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  bsConfig?: Partial<BsDatepickerConfig>;
  profileForm!: UntypedFormGroup;
  profileAgencyForm!: UntypedFormGroup;
  formGroups: FormGroup[] = [];
  currentTab = 'personalDetails';
  photoProfile!: string;
  currentUser:any;
  role:any;
  successmsg = false;
  error = '';
  emailError = '';
  passwordError = '';
  firstNameError = '';
  lastNameError = '';
  searchTerm: string = '';
  submitted = false;
  profileError!:string;
  nameError = '';
  constructor(private formBuilder: FormBuilder,
     private authService:AuthenticationService,
     private userService:UserProfileService,
     private toastr: ToastrService, 
     private sanitizer: DomSanitizer) { }
  imageToShow: any;
  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Pages', active: true },
      { label: 'Profile Settings', active: true }
    ];
   this.getImage()
   
   this.profileForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    mobileNumber: ['', Validators.required] ,
   
  });
  this.profileAgencyForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    mobileNumber: ['', Validators.required] ,
   
  });
  this.editProfile()
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  /**
  * Default Select2
  */
  selectedAccount = 'This is a placeholder';

  getImage() {
    this.userService.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        this.userService.getImage(this.currentUser.photoProfile).subscribe(data => {
          this.createImageFromBlob(data);
        }, error => {
          console.log(error);
        });
      },
      error => {
        console.error('Errorr:', error);
      }
    );
  }
  changeTab(tab: string) {
    this.currentTab = tab;
  }
 editProfile() {
  const email = this.authService.currentUser()['sub'];
  this.role=this.authService.currentUser()['scope']
    this.userService.getUserByEmail(email).subscribe((user: any) => {
      console.log("user in profile -settings",user)
     this.currentUser=user;
      this.profileForm.patchValue({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.phone,
      
      });
     
    });
  }
  get f() { return this.profileForm.controls; }
  get fAgency() { return this.profileAgencyForm.controls; }
  // File Upload
  imageURL: any;
  fileChange(event: any, id: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      if (id == '0') {
        document.querySelectorAll('#cover-img').forEach((element: any) => {
          element.src = this.imageURL;

        });
      }
      if (id == '1') {
        document.querySelectorAll('#user-img').forEach((element: any) => {
          element.src = this.imageURL;
        });
      }
    }

    reader.readAsDataURL(file)
  }
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.userService.uploadProfilePicture(file, this.authService.currentUser()['sub']).subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Response:
              console.log(event.body);
              this.getImage()
              this.imageURL = event.body.url;
              break;
            default:
              break;
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  Default = chatMessagesData;
  selectedCountry = this.Default[228]; // Default selected country
  filterCountries(): void {
    this.Default = this.originalCountries.filter(country =>
      country.countryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      country.countryCode.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  originalCountries = [...chatMessagesData];
  selectValue(data: any) {
    this.selectedCountry = data;
  }
onSearchChange(event: Event): void {
  const searchValue = (event.target as HTMLInputElement).value;
  this.searchTerm = searchValue;
  this.filterCountries();
}



  /**
  * Password Hide/Show
  */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1
  }
  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  profileSubmit() {
    this.submitted = true;
    this.emailError = '';
    this.passwordError = '';
    this.firstNameError = '';
    this.lastNameError = '';
    const fmobileNumber = this.f['mobileNumber'].value;
    let countryCode = this.selectedCountry.countryCode;
    let mobileNumber = `${countryCode} ${fmobileNumber}`;
    const firstName = this.f['firstName'].value;
    const lastName = this.f['lastName'].value;
    const email = this.f['email'].value;
    
    const profileData = new FormData();
    profileData.append('firstName', firstName);
    profileData.append('lastName', lastName);
    profileData.append('email', email);
    profileData.append('mobileNumber', fmobileNumber);
  
   
   
    this.userService.profileManage(profileData).subscribe(
      (response) => {
        this.profileForm.reset()
        this.toastr.success('profile manage successfully', 'Succes');
        this.editProfile()
      },
      (error) => {
        if (error.status === 400) {
          let errorMessage = '';
          for (const field in error.error) {
            if (error.error.hasOwnProperty(field)) {
              errorMessage += `./ ${error.error[field]} <br>`;
            }
          }
          this.profileError = errorMessage.trim();
        } else if(error.status === 500){
          if (error.error.error === 'Email already exists') {
            this.emailError = 'Email already exists';
          }else {
         
          }
        } else {
          this.profileError = 'Une erreur inattendue est survenue, essayez encore';      }
        this.toastr.error(this.profileError || 'Erreur, veuillez réessayer', 'Erreur');
      }
    );
  
  }
  profileAgencySubmit(){
    this.submitted = true;
    this.emailError = '';
    this.nameError = '';
    const fmobileNumber = this.fAgency['mobileNumber'].value;
    let countryCode = this.selectedCountry.countryCode;
    let mobileNumber = `${countryCode} ${fmobileNumber}`;
    const name = this.fAgency['name'].value;
    const email = this.fAgency['email'].value;
    const profileData = new FormData();
    profileData.append('name', name);
    profileData.append('email', email);
    profileData.append('mobileNumber', fmobileNumber);
  
   
   
    this.userService.profileManageAgency(profileData).subscribe(
      (response) => {
        this.profileForm.reset()
        this.toastr.success('profile manage successfully', 'Succes');
        this.editProfile()
      },
      (error) => {
        if (error.status === 400) {
          let errorMessage = '';
          for (const field in error.error) {
            if (error.error.hasOwnProperty(field)) {
              errorMessage += `./ ${error.error[field]} <br>`;
            }
          }
          this.profileError = errorMessage.trim();
        } else if(error.status === 500){
          if (error.error.error === 'Email already exists') {
            this.emailError = 'Email already exists';
          }else {
         
          }
        } else {
          this.profileError = 'Une erreur inattendue est survenue, essayez encore';      }
        this.toastr.error(this.profileError || 'Erreur, veuillez réessayer', 'Erreur');
      }
    );
  
  }

  cancelForm(){
    this.profileForm.reset();
    this.profileAgencyForm.reset();
  }
  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.toastr.error("New Password and Confirm Password don't match.", 'Warning');
      
    }

    const payload = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    };

    this.userService.changePassword(payload).subscribe({
      next: (response) => {
        this.toastr.success('Password changed successfully', 'Succes');

      },
      error: (err) => {
        this.toastr.error('Password change failed', 'Erreur');
      }
    });
  }


}


