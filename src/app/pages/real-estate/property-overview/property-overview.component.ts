import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { SwiperOptions } from 'swiper';

import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { RealestateService } from 'src/app/core/services/realestate.service';

@Component({
  selector: 'app-property-overview',
  templateUrl: './property-overview.component.html',
  styleUrls: ['./property-overview.component.scss']
})

// Property Overview Component
export class PropertyOverviewComponent {
  currentPropertyId:any
 property:any;
 agencyOwner:any;
 role:any
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService ,
    private realeStateService:RealestateService,
    private authService: AuthenticationService,
  ) { }
 
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  ngOnInit(): void {
    this.role=this.authService.currentUser()['scope']
    this.getCurrentPropertyId()
    this.loadProperty()
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Real Estate', active: true },
      { label: 'Property Overview', active: true }
    ];
  }

  getCurrentPropertyId() {
    this.route.paramMap.subscribe(params => {
      this.currentPropertyId = params.get('id');
      console.log("current property",this.currentPropertyId);
    });
  }
  loadProperty() {
    this.realeStateService.getPropertyById(this.currentPropertyId).subscribe((data) => {
      this.property = data;
      console.log('display data', data);
    });
  }

  slidesConfig = {
    // Configuration options for the ngx-slick-carousel
    slidesToShow: 1,
    slidesToScroll: 1
  }

  // Leaflet Options
  options = {
    layers: [
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlbWVzYnJhbmQiLCJhIjoiY2xmbmc3bTV4MGw1ejNzbnJqOWpubzhnciJ9.DNkdZVKLnQ6I9NOz7EED-w', {
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
      })
    ],
    center: L.latLng(39.73, -104.99),
    zoom: 10,
    marker: L.marker([39.73, -104.99])
  }

  grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlbWVzYnJhbmQiLCJhIjoiY2xmbmc3bTV4MGw1ejNzbnJqOWpubzhnciJ9.DNkdZVKLnQ6I9NOz7EED-w', {
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
  })
  
    streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlbWVzYnJhbmQiLCJhIjoiY2xmbmc3bTV4MGw1ejNzbnJqOWpubzhnciJ9.DNkdZVKLnQ6I9NOz7EED-w', {
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
    });
  
  cities = L.layerGroup();

  baseLayers = {
    "Grayscale": this.grayscale,
    "Streets": this.streets
  };

  overlays = {
    "Cities": this.cities
  };

  GroupsLayers = [L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(this.cities)]


  // open chat detail
  openChatbox() {
    document.querySelector('.email-chat-detail')?.classList.toggle('d-block')
  }

}
