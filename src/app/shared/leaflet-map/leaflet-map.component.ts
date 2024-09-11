import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements OnInit{
  private map;

  private initMap(): void {
    this.map = L.map('map', {
      center: [28.384936581887278, 77.27668282996459], // Replace with your office's latitude and longitude
      zoom: 15
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: 'assets/images/marker.webp', 
      iconSize: [50, 80], 
      iconAnchor: [30, 50], 
      popupAnchor: [0, -32] 
    });
    
    L.marker([28.384936581887278, 77.27668282996459], { icon: customIcon }).addTo(this.map) // Replace with your office's latitude and longitude
      .bindPopup('Our Location')
      .openPopup();
  }

  ngOnInit(): void {
    this.initMap();
  }
}
