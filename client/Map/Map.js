import React from 'react';

import locationIconSrc from './img/location.png';
import poiMarkerIconSrc from './img/poi-marker.png';
import mapStyle from './map.less';
import axios from 'axios';

class Map extends React.Component {
  constructor(props) {
    super(props);

    console.log('constructor');
    
    this.state = {
      map: null,
      location: null,
      poiLayer: null,
      userMarkersLayer: null,
      isLoading: false,
      prevDbClickLatLng: null,
    };

    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.onPoiRadioChange = this.onPoiRadioChange.bind(this);
    this.clearUserMarkers = this.clearUserMarkers.bind(this);
    this.saveUserMarkers = this.saveUserMarkers.bind(this);
    this.loadUserMarkers = this.loadUserMarkers.bind(this);
  }

  zoomIn(e) {
    this.state.map.zoomIn(1);
  }

  zoomOut(e) {
    this.state.map.zoomOut(1);
  }

  clearUserMarkers(e) {
    if (this.state.userMarkersLayer)
      this.state.userMarkersLayer.clearLayers();
  }

  saveUserMarkers(e) {
    const markersGeoJson  = this.state.userMarkersLayer.toGeoJSON();

    axios.put('api/users/markers', { markersGeoJson }).then(() => {

    }).catch(err => {
      console.log(err);
    });
  }

  loadUserMarkers(e) {

    axios.get('api/users/markers').then(res => {
      if (this.state.map.hasLayer(this.state.userMarkersLayer))
        this.state.userMarkersLayer.clearLayers();
      else
        this.state.map.addLayer(this.state.userMarkersLayer);
      
      const layer = DG.geoJSON(res.data.markersGeoJson);

      this.state.userMarkersLayer.addLayer(layer);

    }).catch(err => {
      console.log(err);
    });
  }

  onPoiRadioChange(e) {
    const { apiKey, radius, location } = this.state;
    const googleLatLng = new google.maps.LatLng(location.lat, location.lng);
    const type = e.target.value;

    const request = {
       location: googleLatLng,
       rankBy: google.maps.places.RankBy.DISTANCE,
       type: type
     };

    const service = new google.maps.places.PlacesService(document.createElement('div'));
    
    if (type === 'none' && this.state.poiLayer)
      return this.state.poiLayer.clearLayers();

    service.nearbySearch(request, (res, status) => {
      
      if (this.state.poiLayer)
        this.state.poiLayer.clearLayers();

      const poiMarkerIcon = DG.icon({
        iconUrl: poiMarkerIconSrc,
        iconSize: [44, 44]
      });

      res.forEach(item => {

        this.state.poiLayer.addLayer(
          DG.marker([item.geometry.location.lat(), item.geometry.location.lng()], {icon: poiMarkerIcon})
            .bindPopup(item.name)
        );
        if (!this.state.map.hasLayer(this.state.poiLayer))
          this.state.map.addLayer(this.state.poiLayer);
      });
    });
  }

  componentWillMount() {
    console.log('component will mount');
    DG.then(() => {

      const map = DG.map('map', {
        center: [54.98, 82.89],
        zoom: 15,
        zoomControl: false,
        fullscreenControl: false,
        doubleClickZoom: false
      });

      const poiLayer = DG.geoJSON();
      const userMarkersLayer = DG.geoJSON();

      map.locate({setView: true, maxZoom: 15});

      map.on('dblclick', res => {

        if (res.latlng.equals(this.state.prevDbClickLatLng))
          return;
        else
          this.state.prevDbClickLatLng = res.latlng;
          // this.setState({prevDbClickLatLng: res.latlng});

        this.state.userMarkersLayer.addLayer(DG.marker(res.latlng));
        
        if (!this.state.map.hasLayer(this.state.userMarkersLayer))
          this.state.map.addLayer(this.state.userMarkersLayer);

      });

      map.on('locationfound ', res => {

        const locationIcon = DG.icon({
          iconUrl: locationIconSrc,
          iconSize: [44, 44]
        });

        DG.marker(res.latlng, {icon: locationIcon}).addTo(map).bindLabel('Your location', {static: false});
        // this.setState({ location: res.latlng });
        this.state.location = res.latlng;
      });

      map.on('locationerror', err => {
        console.log('err', err);
      });
      
      this.setState({ map, poiLayer, userMarkersLayer });
    })
  }
  
  componentDidMount() {
    console.log('component mounted');
    let ss = document.getElementById('map');
    console.log(ss);
  }

  componentWillUnmount() {
    console.log('component will unmounted');

    this.state.map.remove();

    this.setState({
      map: null,
      location: null,
      poiLayer: null,
      userMarkersLayer: null,
      isLoading: false,
      prevDbClickLatLng: null,
    });
  }

  render() {
    console.log('render');
    return (
      <div>
        <div className="map row-fluid clearfix">
          <div className="buttons col-md-5 col-md-offset-4">
            <button 
              onClick={this.zoomIn} 
              className="map btn btn-default">Zoom in
            </button>
            <button 
              onClick={this.zoomOut} 
              className="map btn btn-default">Zoom out
            </button>
            <button  
              onClick={this.saveUserMarkers}
              className="map btn btn-default">Save users markers
            </button>
            <button 
              onClick={this.loadUserMarkers}
              className="map btn btn-default">Load users markers
            </button>
            <button
              onClick={this.clearUserMarkers}
              className="map btn btn-danger">Clear users markers
            </button>
          </div>
        </div>
        <div id="map-sidebar">
          <div className="radio">
            <label><input type="radio" onClick={this.onPoiRadioChange} value="none" defaultChecked name="poiradio"/>none</label>
          </div>
          <div className="radio">
            <label><input type="radio" onClick={this.onPoiRadioChange} value="pharmacy" name="poiradio"/>pharmacies</label>
          </div>
          <div className="radio">
            <label><input type="radio" onClick={this.onPoiRadioChange} value="gas_station" name="poiradio"/>gas stations</label>
          </div>
          <div className="radio">
            <label><input type="radio" onClick={this.onPoiRadioChange} value="school" name="poiradio"/>schools</label>
          </div>
          <div className="radio">
            <label><input type="radio" onClick={this.onPoiRadioChange} value="restaurant" name="poiradio"/>restaurants</label>
          </div>
        </div>
        <div id="map"></div>
      </div>
    );
  }
}

export default Map;