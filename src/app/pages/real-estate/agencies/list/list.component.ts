import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Store } from '@ngrx/store';
import { addAgenciesData, deleteAgenciesData, fetchAgenciesData, updateAgenciesData } from 'src/app/store/Agency/agency.action';
import { selectData } from 'src/app/store/Agency/agency-selector';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { cloneDeep } from 'lodash';
import { AgencyService } from 'src/app/core/services/agency.service';
import { ToastrService } from 'ngx-toastr'; 
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [DecimalPipe]
})

// List Component
export class ListComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  agencies: any;

  agencyForm!: UntypedFormGroup;
  agencyFormEdit!: UntypedFormGroup;
  submitted = false;
  masterSelected!: boolean;
  files: File[] = [];
  bedroom: any;
  agencylist: any
  searchTerm: any
  searchResults: any;
  fileLogo: File | null = null;
  addAgencyError: string | null = null;
  logoUrl:any
  editAgencyId:any
  role:any
  @ViewChild('addAgencyModal', { static: false }) addAgencyModal?: ModalDirective;
  @ViewChild('editAgencyModal', { static: false }) editAgencyModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  deleteID: any;
  sortValue: any = 'Since';

  constructor(private formBuilder: UntypedFormBuilder, public store: Store,private agencyService:AgencyService,
    private authService: AuthenticationService,private toastr: ToastrService) {
  }
 
  ngOnInit(): void {
    this.role=this.authService.currentUser()['scope']
    console.log('role in the properties grid ',this.role);
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Agencies', active: true },
      { label: 'List View', active: true }
    ];

    /**
 * Form Validation
 */
    this.agencyForm = this.formBuilder.group({
      logo: [null],
      sinceYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]], 
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(22),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]]
    });
 
    this.agencyFormEdit = this.formBuilder.group({
      logo: [null],
      sinceYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]], 
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]]
    });

    // Fetch Data
    setTimeout(() => {
     this.loadAgencies()
    }, 1000)
  }

  // File Upload
  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  uploadedFiles: any[] = [];

  onUploadSuccess(event: any) {
    setTimeout(() => {
      this.fileLogo = event.target.files[0];
      this.logoUrl=null
    }, 0);
  }

  loadAgencies() {
    this.agencyService.getAllAgency().subscribe((data) => {
      console.log(data);
      
      this.agencies = data;
      this.agencylist = data;
      this.agencies = cloneDeep(this.agencylist.slice(0, 10))
    });
    document.getElementById('elmLoader')?.classList.add('d-none')

  }

  saveAgencyModalHide(){
    this.addAgencyModal?.hide(); 
    this.agencyForm.reset();
    this.fileLogo = null;
  }
  saveAgency() {
    
      const registerData = new FormData();
      registerData.append('name', this.agencyForm.value.name);
      registerData.append('sinceYear', this.agencyForm.value.sinceYear);
      registerData.append('description', this.agencyForm.value.description);
      registerData.append('email', this.agencyForm.value.email);
      registerData.append('password', this.agencyForm.value.password);
      registerData.append('mobileNumber', this.agencyForm.value.mobileNumber);
      registerData.append('address', this.agencyForm.value.address);
  
      if (this.fileLogo) {
        registerData.append('logo', this.fileLogo);
      }
  
      this.agencyService.saveAgency(registerData).subscribe(
        response => {
          console.log('agency added successfully:', response);
          this.saveAgencyModalHide()
          this.toastr.success('agency added successfully', 'Succes');
          this.loadAgencies();
        },
        error => {
          if (error.status === 400) {
            let errorMessage = '';
            for (const field in error.error) {
              if (error.error.hasOwnProperty(field)) {
                errorMessage += `./ ${error.error[field]} <br>`;
              }
            }
            this.addAgencyError = errorMessage.trim();
          } else {
            this.addAgencyError = 'Une erreur inattendue est survenue, essayez encore';
          }
  
          this.toastr.error(this.addAgencyError || 'Erreur, veuillez réessayer', 'Erreur');
        }
      );
    
  }



  editAgencyModalHide(){
    this.editAgencyModal?.hide();
    this.agencyFormEdit.reset();
    this.fileLogo = null;
  }

  editAgency(id: any) {
    this.agencyService.getAgencyById(id).subscribe((agency: any) => {
      this.editAgencyId = id;
      this.agencyFormEdit.patchValue({
        name: agency.name,
        description: agency.description,
        sinceYear: agency.sinceYear,     
        email: agency.email,
        mobileNumber:agency.phone,
        address:agency.address

      });
      this.fileLogo = null; 
      this.logoUrl =`http://localhost:1919/user/image/${agency.photoProfile}`;
      this.editAgencyModal?.show();
    });
}

updateAgency() {
      const updateData = new FormData();
      updateData.append('name', this.agencyFormEdit.value.name);
      updateData.append('sinceYear', this.agencyFormEdit.value.sinceYear);
      updateData.append('description', this.agencyFormEdit.value.description);
      updateData.append('email', this.agencyFormEdit.value.email);
      updateData.append('password', this.agencyFormEdit.value.password);
      updateData.append('mobileNumber', this.agencyFormEdit.value.mobileNumber);
      updateData.append('address', this.agencyFormEdit.value.address);
      if (this.fileLogo) {
        updateData.append('logo', this.fileLogo);
      }
      this.agencyService.updateAgency(this.editAgencyId, updateData).subscribe(
        response => {
          this.toastr.success('agency updated successfuly !', 'Succes');  
          console.log('categorie updated successfully:', response);
          this.loadAgencies();
         this.editAgencyModalHide();
        },
        error => {
          this.toastr.error('Erreur in update agency.', 'Erreur'); 
      
        }
      );
    
}

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Edit Data
  editList(id: any) {
 /*   this.uploadedFiles = [];
    this.addAgencies?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'
    var editData = this.agency[id]
    this.uploadedFiles.push({ 'dataURL': editData.img, 'name': editData.imgalt, 'size': 1024, });

    this.agenciesForm.patchValue(this.agency[id]);*/
  }




  // Delete Product
  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }
  confirmDelete(id: any) {
    this.agencyService.deleteAgency(this.deleteID).subscribe(data=>{
      this.toastr.success('agency deleted successfuly !', 'Succes'); 
      this.deleteRecordModal?.hide()
      this.loadAgencies();
    
    },error=>{
      this.toastr.error('Erreur deleting agency.', 'Erreur'); 
      console.log(error)
    });
  }

  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.masterSelected = ev.target.checked;
    this.agencies.forEach((data: any) => { data.state = this.masterSelected });
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.agencies.length; i++) {
      if (this.agencies[i].state == true) {
        result = this.agencies[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }

  // Sort Data
  direction: any = 'asc';
  sortBy(column: any, value: any) {
    this.sortValue = value;
    this.onSort(column)
  }

  onSort(column: any) {
    if (this.direction == 'asc') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    const sortedArray = [...this.agencies]; // Create a new array
    sortedArray.sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.agencies = sortedArray;
  }
  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  // Page Changed
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.agencies = this.agencylist.slice(startItem, endItem);
  }

  // Search Data
  performSearch(): void {
    this.searchResults = this.agencylist.filter((item: any) => {
      return item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.address.toLowerCase().includes(this.searchTerm.toLowerCase())

    })
    this.agencies = this.searchResults.slice(0, 10);
    this.updateNoResultDisplay()
  }


  // no result 
  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement
    if (this.searchResults && this.agencies.length == 0) {
      noResultElement.style.display = 'block';
      paginationElement.classList.add('d-none')
    } else {
      noResultElement.style.display = 'none';
      paginationElement.classList.remove('d-none')

    }
  }
}
