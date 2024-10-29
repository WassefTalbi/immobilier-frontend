import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from 'ngx-slider-v2';
// Page Route
import { AgenciesRoutingModule } from './agencies-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

// Leaflet map
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// dropzone
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

// bootstrap component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';

// Component
import { ListComponent } from './list/list.component';
import { OverviewComponent } from './overview/overview.component';
import { OwnerComponent } from './owner/owner.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CountUpModule } from 'ngx-countup';
import { SimplebarAngularModule } from 'simplebar-angular';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
  declarations: [
    ListComponent,
    OverviewComponent,
    OwnerComponent,
  ],
  imports: [
    CommonModule,
    AgenciesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    DropzoneModule,
    LeafletModule,
    NgxSliderModule,
    SimplebarAngularModule,
    CountUpModule,
    SlickCarouselModule,
    NgApexchartsModule,
    TooltipModule,
    DropzoneModule,
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ]

})
export class AgenciesModule { }
