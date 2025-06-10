import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Page Route
import { GestionExpertiseRoutingModule } from './gestion-expertise-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';

// Count To
import { CountUpModule } from 'ngx-countup';

// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';

// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';

// Range Slider
import { NgxSliderModule } from 'ngx-slider-v2';

// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';

// dropzone
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

// Leaflet Map
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// bootstrap component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RatingModule } from 'ngx-bootstrap/rating';

// Component
import { MissionComponent } from './mission/mission.component';
import { UserComponent } from './user/user.component';
import { FilterByStatutPipe } from './FilterByStatutPipe';
import { PowerComponent } from './power/power.component';
import { RapportComponent } from './rapport/rapport.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { MeetingComponent } from './meeting/meeting.component';
import { ExtractionComponent } from './extraction/extraction.component';
import { ContaminationComponent } from './contamination/contamination.component';
import { ConteneurComponent } from './conteneur/conteneur.component';
import { FileSizePipe } from './FileSizePipe';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
  declarations: [
    MissionComponent,
    UserComponent,
    PowerComponent,
    RapportComponent,
    ChatbotComponent,
    MeetingComponent,
    ExtractionComponent,
    ContaminationComponent,
    ConteneurComponent,
    FilterByStatutPipe,FileSizePipe
  ],
  imports: [
    CommonModule,
    GestionExpertiseRoutingModule,
    SharedModule,
    SimplebarAngularModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    RatingModule.forRoot(),
    CountUpModule,
    LeafletModule,
    SlickCarouselModule,
    NgApexchartsModule,
    TooltipModule,
    NgxSliderModule,
    DropzoneModule,
    FlatpickrModule.forRoot()
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
  exports: [FilterByStatutPipe,FileSizePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class GestionExpertiseModule { }
