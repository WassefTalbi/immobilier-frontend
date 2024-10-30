import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
// Date Format
import { DatePipe } from '@angular/common';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Store } from '@ngrx/store';
import { addagentData, deleteagentData, fetchagentData, updateagentData } from 'src/app/store/Agent/agent.action';
import { selectagentData } from 'src/app/store/Agent/agent-selector';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ClientService } from 'src/app/core/services/client.service';

 
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [DecimalPipe]
})

// list Component
export class ListComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  agents: any;
  AgentList: any;

  agentForm!: UntypedFormGroup;
  submitted = false;
  masterSelected!: boolean;
  agentlist: any
  bedroom: any;
  term: any
  files: File[] = [];
  role:any
  @ViewChild('addAgent', { static: false }) addAgent?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  deleteID: any;

  constructor(private formBuilder: UntypedFormBuilder, private datePipe: DatePipe, public store: Store,
    private authService: AuthenticationService,private toastr: ToastrService,private clientService:ClientService
    
    ) {
  }

  ngOnInit(): void {
    this.role=this.authService.currentUser()['scope']
    console.log('role in the properties grid ',this.role);
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Clients', active: true },
      { label: 'Client List', active: true }
    ];

    /**
 * Form Validation
 */
    this.agentForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      status: ['', [Validators.required]],
      location: ['', [Validators.required]],
      img: [''],
      joiningdate: null
    });

    // store data
    setTimeout(() => {
      this.loadClients()
    }, 1000)
  }


  loadClients() {
    this.clientService.getAllClient().subscribe((data) => {
      console.log(data);
      this.agents = data;
      this.agentlist = data;
      this.agents = cloneDeep(this.agentlist.slice(0, 10))
    });
    document.getElementById('elmLoader')?.classList.add('d-none')

  }

  // File Upload
  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };




 




  // Delete Product
  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }
  confirmDelete() {
    this.clientService.deleteClient(this.deleteID).subscribe(data=>{
      this.toastr.success('client deleted successfuly !', 'Succes'); 
      this.deleteRecordModal?.hide()
      this.loadClients();
    
    },error=>{
      this.toastr.error('Erreur deleting client.', 'Erreur'); 
      console.log(error)
    });
  }

  checkedValGet: any[] = [];
  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.agents.forEach((x: { state: any; }) => x.state = ev.target.checked)
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.agents.length; i++) {
      if (this.agents[i].state == true) {
        result = this.agents[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }

  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < this.agents.length; i++) {
      if (this.agents[i].state == true) {
        result = this.agents[i].id;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    checkedVal.length > 0 ? document.getElementById("remove-actions")?.classList.remove('d-none') : document.getElementById("remove-actions")?.classList.add('d-none');
  }


  // Sort Data
  direction: any = 'asc';
  onSort(column: any) {
    if (this.direction == 'asc') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    const sortedArray = [...this.agents]; // Create a new array
    sortedArray.sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.agents = sortedArray;
  }
  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  // filterdata
  filterdata() {
    if (this.term) {
      this.agents = this.agentlist.filter((el: any) => el.email.toLowerCase().includes(this.term.toLowerCase()))
    } else {
      this.agents = this.agentlist.slice(0, 10)
    }
    // noResultElement
    this.updateNoResultDisplay();
  }

  // no result 
  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;

    if (this.term && this.agents.length == 0) {
      noResultElement.style.display = 'block';
    } else {
      noResultElement.style.display = 'none';
    }
  }


  // Page Changed
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.agents = this.agentlist.slice(startItem, endItem);
  }

}
