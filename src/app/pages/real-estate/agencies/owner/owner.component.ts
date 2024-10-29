import { Component, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr'; 
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Options } from '@angular-slider/ngx-slider';

import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { RealestateService } from 'src/app/core/services/realestate.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { AuthenticationService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrl: './owner.component.scss',
  providers: [DecimalPipe]

})
export class OwnerComponent {
  role:any;
  files: File[] = [];
  page: number = 1;
  selectedPropertyType: string = "Villa";
  breadCrumbItems!: Array<{}>;
  submitted = false;
  endItem: any;
  fileLogo: File | null = null;
  editpropertyId: any;
  addPropertyError: string | null = null;
  logoUrl: any;
  bedroom: any;
  properties: any;
  propertiesList: any;
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
  propertyFormEdit!: UntypedFormGroup;
  additionalFeatures: string[] = [];
  @ViewChild('addPropertyModal', { static: false }) addPropertyModal?: ModalDirective;
  @ViewChild('editPropertyModal', { static: false }) editPropertyModal?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  deleteID: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private propertyService: RealestateService,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.role=this.authService.currentUser()['scope']
    console.log('role in the properties grid ',this.role);
    // Breadcrumb
    this.breadCrumbItems = [
      { label: 'Agency', active: true },
      { label: 'Property', active: true }
    ];
    
    setTimeout(() => {
      this.loadProperties();
    }, 1000);

    // Form Validation
    this.initForms();
  }

  initForms() {
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
      image: [null],
    });

    this.propertyFormEdit = this.formBuilder.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      bedroom: ['', [Validators.required]],
      bathroom: ['', [Validators.required]],
      area: ['', [Validators.required]],
      price: ['', [Validators.required]],
      agent: ['', [Validators.required]],
      requirement: ['', [Validators.required]],
      location: ['', [Validators.required]],
      image: [null],
    });
  }

  features = [
    { id: 'swimmingPool', label: 'Swimming Pool', selected: false },
    { id: 'airConditioning', label: 'Air Conditioning', selected: false },
    { id: 'electricity', label: 'Electricity', selected: false },
    { id: 'nearGreenZone', label: 'Near Green Zone', selected: false },
    { id: 'nearShop', label: 'Near Shop', selected: false },
    { id: 'nearSchool', label: 'Near School', selected: false },
    { id: 'parkingAvailable', label: 'Parking Available', selected: false },
    { id: 'internet', label: 'Internet', selected: false },
    { id: 'balcony', label: 'Balcony', selected: false },
  ];

  onFeatureChange(featureId: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const selectedFeature = this.features.find(feature => feature.id === featureId);
  
    if (selectedFeature) {
      selectedFeature.selected = checkbox.checked;
  
      // Add or remove featureId based on checkbox status
      if (checkbox.checked) {
        this.additionalFeatures.push(featureId);
      } else {
        this.additionalFeatures = this.additionalFeatures.filter(id => id !== featureId);
      }
      console.log('Updated additionalFeatures:', this.additionalFeatures);
    }
  }
 

  savePropertyModalHide() {
    this.addPropertyModal?.hide(); 
    this.propertyForm.reset();
    this.fileLogo = null;
  }

  editPropertyModalHide() {
    this.editPropertyModal?.hide();
    this.propertyFormEdit.reset();
    this.fileLogo = null;
  }

  loadProperties() {
    this.propertyService.getAllPropertiesByAgency().subscribe((data) => {
      this.properties = data.properties;
      console.log(data)
      this.propertiesList = data.properties;
      this.properties = this.propertiesList.slice(0, 8);
    });
    document.getElementById('elmLoader')?.classList.add('d-none');
  }


  onUploadSuccess(event: any) {
    setTimeout(() => {
      this.fileLogo = event.target.files[0];
      this.logoUrl=null
    }, 0);
  }


  // Add Property
  saveProperty() {
    const formData = new FormData();
    formData.append('title', this.propertyForm.get('title')?.value);
    formData.append('type', this.propertyForm.get('type')?.value);
    formData.append('bedroom', this.propertyForm.get('bedroom')?.value);
    formData.append('bathroom', this.propertyForm.get('bathroom')?.value);
    formData.append('area', this.propertyForm.get('area')?.value);
    formData.append('price', this.propertyForm.get('price')?.value);
    formData.append('requirement', this.propertyForm.get('requirement')?.value);
    formData.append('location', this.propertyForm.get('location')?.value);
    this.additionalFeatures.forEach((feature) => {
      formData.append('additionalFeatures', feature);
    });
   
    if (this.fileLogo) {
      formData.append('image', this.fileLogo);
    }
    this.propertyService.saveProperty(formData).subscribe(response => {
      console.log('Property saved', response);
      this.toastr.success('Property added successfully!', 'Success'); 
      this.loadProperties(); 
      this.savePropertyModalHide();
    }, error => {
      this.toastr.error('Error saving property.', 'Error'); 
      console.error('Error saving property', error);
    });
  }

  editProperty(id: any) {
    this.propertyService.getPropertyById(id).subscribe((property: any) => {
      console.log(property);
      
      this.editpropertyId = id;
      this.propertyFormEdit.patchValue({
        title: property.title,
        type: property.type,
        bedroom: property.bedroom,
        bathroom: property.bathroom,
        area: property.area,
        price: property.price,
        requirement: property.requirement,
        location: property.location,
      });
      const featureNames = property.features.map((feature: any) => feature.featureName);
      this.features.forEach(feature => {
        feature.selected = featureNames.includes(feature.id);
      });
      this.logoUrl = `http://localhost:1919/user/image/${property.image}`;
      this.editPropertyModal?.show();
    });
  }
  

  updateProperty() {

    
      const formData = new FormData();
      formData.append('title', this.propertyFormEdit.get('title')?.value);
      formData.append('type', this.propertyFormEdit.get('type')?.value);
      formData.append('bedroom', this.propertyFormEdit.get('bedroom')?.value);
      formData.append('bathroom', this.propertyFormEdit.get('bathroom')?.value);
      formData.append('area', this.propertyFormEdit.get('area')?.value);
      formData.append('price', this.propertyFormEdit.get('price')?.value);
      formData.append('requirement', this.propertyFormEdit.get('requirement')?.value);
      formData.append('location', this.propertyFormEdit.get('location')?.value);
      this.additionalFeatures.forEach((feature) => {
        formData.append('additionalFeatures', feature);
      });

      if (this.fileLogo) {
        formData.append('image', this.fileLogo); 
      }
      this.propertyService.updateProperty(this.editpropertyId, formData).subscribe(
        response => {
          this.toastr.success('Property updated successfully!', 'Success');  
          console.log('Property updated successfully:', response);
          this.loadProperties();
          this.editPropertyModalHide();
        },
        error => {
          this.toastr.error('Error updating property.', 'Error'); 
          console.error('Error updating property:', error);
        }
      );
    
  }

  // Hide/Show Filter
  showFilter() {
    const filterStyle = (document.getElementById("propertyFilters") as HTMLElement).style.display;
    (document.getElementById("propertyFilters") as HTMLElement).style.display = filterStyle === 'none' ? 'block' : 'none';
  }

  starredProduct(id: any, event: any) {
    event.target.classList.toggle('active');
    this.properties[id].starred = !this.properties[id].starred; 
  }

  bedroomFilter(ev: any) {
    if (ev.target.checked) {
      this.properties = this.propertiesList.filter((el: any) => el.bedroom == ev.target.value);
    } else {
      this.properties = this.propertiesList;
    }
  }

  bathroomFilter(ev: any) {
    if (ev.target.checked) {
      this.properties = this.propertiesList.filter((el: any) => el.bathroom == ev.target.value); 
    } else {
      this.properties = this.propertiesList;
    }
  }

  // Location-wise filter
  filterByLocation() {
    const location = (document.getElementById("select-location") as HTMLInputElement).value;
    this.properties = location ? 
      this.propertiesList.filter((data:any) => data.location === location) : 
      this.propertiesList;
    this.updateNoResultDisplay();
  }

  // Range Slider Wise Data Filter
  priceRangeFilter() {
    const min = this.minValue;
    const max = this.maxValue;

    this.properties = this.propertiesList.filter((property:any) => property.price >= min && property.price <= max);
    this.updateNoResultDisplay();
  }

  // Pagination
  onPageChanged(event: PageChangedEvent) {
    this.page = event.page;
  }

  // Delete Property
  deleteProperty(id: any) {
    this.deleteID = id;
    this.deleteRecordModal?.show();
  }

  confirmDelete() {
    this.propertyService.deleteProperty(this.deleteID).subscribe(response => {
      this.toastr.success('Property deleted successfully!', 'Success');
      console.log('Property deleted:', response);
      this.loadProperties();
      this.deleteRecordModal?.hide();
    }, error => {
      this.toastr.error('Error deleting property.', 'Error');
      console.error('Error deleting property:', error);
    });
  }



  onRemove(event: File) {
    this.fileLogo = null;
  }

  updateNoResultDisplay() {
    if (this.properties.length === 0) {
      document.getElementById("noResult")?.classList.remove('d-none');
      document.getElementById("propertyGrid")?.classList.add('d-none');
    } else {
      document.getElementById("noResult")?.classList.add('d-none');
      document.getElementById("propertyGrid")?.classList.remove('d-none');
    }
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.properties = this.propertiesList.slice(startItem, endItem);
  }
  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  property() {
    this.properties = this.propertiesList.filter((data: any) => {
      if (this.selectedPropertyType === "") {
        return true
      } else {
        return data.type === this.selectedPropertyType
      }
    })
  }
  valueChange(event: number, isMinValue: boolean) {
    if (isMinValue) {
      this.minValue = event;
    } else {
      this.maxValue = event;
    }

  }
  location() {
    const location = (document.getElementById("select-location") as HTMLInputElement).value;
    if (location) {
      this.properties = this.propertiesList.filter((data: any) => {
        return data.location.toLowerCase().includes(location.toLowerCase());
      });
    } else {
      this.properties = this.propertiesList;
    }
    this.updateNoResultDisplay();
  }
  starredproduct(id: any, event: any, star: any) {
    event.target.classList.toggle('active')
    if (star == false) {
      this.properties[id].starred = true
    } else {
      this.properties[id].starred = false
    }
  }

    // File Upload
    public dropzoneConfig: DropzoneConfigInterface = {
      clickable: true,
      addRemoveLinks: true,
      previewsContainer: false,
    };
  

}
