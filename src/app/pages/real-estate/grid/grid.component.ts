import { Component, ViewChild } from '@angular/core';
// import { EstateGridService } from './grid.service';
import { DecimalPipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// import { estateList } from './data';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Options } from '@angular-slider/ngx-slider';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Store } from '@ngrx/store';
import { addlistingGridData, deletelistingGridData, fetchlistingGridData, updatelistingGridData } from 'src/app/store/App-realestate/apprealestate.action';
import { selectData } from 'src/app/store/App-realestate/apprealestate-selector';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { RealestateService } from 'src/app/core/services/realestate.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [DecimalPipe]
})

// Grid Component
export class GridComponent {
  files: File[] = [];
  page: number = 1
  selectedPropertyType: string = "Villa"
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  productslist: any
 
  submitted = false;
  products: any;
  endItem: any
  // price: any = [500, 3800];

  bedroom: any;

  // Price Slider
  pricevalue: number = 100;
  minValue = 500;
  maxValue = 3800;
  options: Options = {
    floor: 0,
    ceil: 5000,
    translate: (value: number): string => {
      return '$' + value;
    },
  };

  propertyForm!: UntypedFormGroup;
  selectedFile: File | null = null;
  additionalFeatures = {
    swimmingPool: false,
    airConditioning: false,
    electricity: false,
    nearGreenZone: false,
    nearShop: false,
    nearSchool: false,
    parkingAvailable: false,
    internet: false,
    balcony: false
  };

  
  @ViewChild('addProperty', { static: false }) addProperty?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  deleteID: any;
  editData: any;

  constructor(private formBuilder: UntypedFormBuilder,private propertyService:RealestateService, public store: Store) {
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Real Estate', active: true },
      { label: 'Listing Grid', active: true }
    ];
    setTimeout(() => {
      this.store.dispatch(fetchlistingGridData());
      this.store.select(selectData).subscribe((data) => {
        this.products = data;
        this.productslist = data;
        this.products = this.productslist.slice(0, 8)
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000);

    /**
   * Form Validation
   */
    this.propertyForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      bedroom: ['', [Validators.required]],
      bathroom: ['', [Validators.required]],
      area: ['', [Validators.required]],
      price: ['', [Validators.required]],
      agent: ['', [Validators.required]],
      requirement: ['', [Validators.required]],
      location: ['', [Validators.required]],
      streetAddress: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      img: [null],
     
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onFeatureChange(feature: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.additionalFeatures[feature as keyof typeof this.additionalFeatures] = checkbox.checked;
  }

  // Hide/Show Filter
  showFilter() {
    const filterStyle = (document.getElementById("propertyFilters") as HTMLElement).style.display;
    if (filterStyle == 'none') {
      (document.getElementById("propertyFilters") as HTMLElement).style.display = 'block'
    } else {
      (document.getElementById("propertyFilters") as HTMLElement).style.display = 'none'
    }
  }

  // Add to starr
  starredproduct(id: any, event: any, star: any) {
    event.target.classList.toggle('active')
    if (star == false) {
      this.products[id].starred = true
    } else {
      this.products[id].starred = false
    }
  }

  // filter bedroom wise
  bedroomFilter(ev: any) {
    if (ev.target.value != '') {
      if (ev.target.checked == true) {
        this.products = this.productslist.filter((el: any) => {
          return el.bedroom == ev.target.value
        })
      }
    } else {
      this.products = this.productslist
    }
  }

  // filter of bathrom wise
  bathroomFilter(ev: any) {
    if (ev.target.value != '') {
      if (ev.target.checked == true) {
        this.products = this.productslist.filter((el: any) => {
          return el.bedroom == ev.target.value
        })
      }
    } else {
      this.products = this.productslist
    }
  }

  // location wise filter
  location() {
    const location = (document.getElementById("select-location") as HTMLInputElement).value
    if (location) {
      this.products = this.productslist.filter((data: any) => {
        return data.location === location
      })
    } else {
      this.products = this.productslist
    }
    this.updateNoResultDisplay()
  }

  /**
 * Range Slider Wise Data Filter
 */
  valueChange(event: number, isMinValue: boolean) {
    if (isMinValue) {
      this.minValue = event;
    } else {
      this.maxValue = event;
    }

  }

  property() {
    this.products = this.productslist.filter((data: any) => {
      if (this.selectedPropertyType === "") {
        return true
      } else {
        return data.type === this.selectedPropertyType
      }
    })
  }

  // Edit Data
  editList(id: any) {
    this.uploadedFiles = [];
    this.addProperty?.show()
    var modaltitle = document.querySelector('.modal-title') as HTMLAreaElement
    modaltitle.innerHTML = 'Edit Product'
    var modalbtn = document.getElementById('add-btn') as HTMLAreaElement
    modalbtn.innerHTML = 'Update'

    this.editData = this.products[id]
    this.uploadedFiles.push({ 'dataURL': this.editData.img, 'name': this.editData.imgalt, 'size': 1024, });
    this.propertyForm.patchValue(this.products[id]);
  }

  // Add Property
  saveProperty() {
    const formData = new FormData();

    // Append form fields individually
    formData.append('title', this.propertyForm.get('title')?.value);
    formData.append('type', this.propertyForm.get('type')?.value);
    formData.append('bedroom', this.propertyForm.get('bedroom')?.value);
    formData.append('bathroom', this.propertyForm.get('bathroom')?.value);
    formData.append('area', this.propertyForm.get('area')?.value);
    formData.append('price', this.propertyForm.get('price')?.value);
    formData.append('agent', this.propertyForm.get('agent')?.value);
    formData.append('requirement', this.propertyForm.get('requirement')?.value);
    formData.append('location', this.propertyForm.get('location')?.value);
    
    // Append address-related fields
    formData.append('streetAddress', this.propertyForm.get('streetAddress')?.value);
    formData.append('state', this.propertyForm.get('state')?.value);
    formData.append('country', this.propertyForm.get('country')?.value);
    formData.append('zipcode', this.propertyForm.get('zipcode')?.value);
  
    // Append additional features (as a JSON string)
    formData.append('additionalFeatures', JSON.stringify(this.additionalFeatures));
  
    // Append the image file if selected
    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }
  
    // Call the property service to save the property
    this.propertyService.saveProperty(formData).subscribe(response => {
      console.log('Property saved', response);
    }, error => {
      console.error('Error saving property', error);
    });
  }
  // Delete Product
  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  confirmDelete() {
    this.store.dispatch(deletelistingGridData({ id: this.deleteID.toString()}));
    this.deleteRecordModal?.hide()
  }


  // File Upload
  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  uploadedFiles: any[] = [];

  // File Upload
  imageURL: any;
  onUploadSuccess(event: any) {
    setTimeout(() => {
      this.uploadedFiles.push(event[0]);
      this.propertyForm.controls['img'].setValue(event[0].dataURL);
    }, 0);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Page Changed
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.products = this.productslist.slice(startItem, endItem);
  }

  // no result 
  updateNoResultDisplay() {
    const noResultElement = document.getElementById('noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement;

    if (this.products.length === 0) {
      noResultElement.style.display = 'block';
      paginationElement.classList.add('d-none')
    } else {
      noResultElement.style.display = 'none';
      paginationElement.classList.remove('d-none')
    }
  }
}
