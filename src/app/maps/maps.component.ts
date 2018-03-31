import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
// import * as L from 'leaflet';
import * as ol from 'ol';
import OlMap from 'ol/map';
import OlTileLayer from 'ol/layer/tile';
import OlOSM from 'ol/source/osm';
import OlView from 'ol/view';
import OlCon from 'ol/control';
import OlFullScreen from 'ol/control/fullscreen';
import OlProj from 'ol/proj';
import OlGMap from 'ol/source/xyz';
import OlVectorLayer from 'ol/layer/vector';
import OlSourceVector from 'ol/source/vector';
import OlStyle from 'ol/style/style';
import OlStyleStroke from 'ol/style/stroke';
import OlStyleCircle from 'ol/style/circle';
import OlStyleFill from 'ol/style/fill';
import OlStyleIcon from 'ol/style/icon';
import OlFeature from 'ol/feature';
import OlGeomPoint from 'ol/geom/point';
import OlGeoJSON from 'ol/format/geojson';
import OlTileJSON from 'ol/source/tilejson';
import OlOverlay from 'ol/overlay';
import OlGeomLineString from 'ol/geom/linestring';
import OlDraw from 'ol/interaction/draw';

import { ApiServiceService } from '../api-service.service';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
    @ViewChild('gmap') gmapElement: any;
    map: OlMap;
    // source: OlOSM;
    // layer: OlTileLayer;
    view: OlView;
    overlay: OlOverlay;
    public featureData: any;
    public vehicleDetail: any;
    private vectorSource: any;
    private featuresSource: any;
    private vectorLayer: any;
    gmap: google.maps.Map;
    constructor( private apiservice: ApiServiceService ) { }

    ngOnInit() {
        this.mapFunc();
    }

    mapFunc(): void {
        this.featuresSource = [];
        this.apiservice.getFeaturesDashboard().subscribe(
            data => {
                this.featureData = data;
                for (let i = 0; i < this.featureData.length; i++) {
                    const feature = this.featureData[i];
                    const x = +feature.long;
                    const y = +feature.lat;
                    const h = +feature.heading;
                    const coordinate = OlProj.transform([x, y], 'EPSG:4326', 'EPSG:3857');
                    const iconFeature = new OlFeature({
                        geometry: new OlGeomPoint(coordinate),
                        vehicleId: feature.id_mobil,
                        platNumber: feature.plat_number,
                        driverId: feature.driver[0].id_driver ? feature.driver[0].id_driver : '-',
                        driverName: feature.driver[0].name ? feature.driver[0].name : '-',
                        engineStatus: feature.engine_status === 1 ? 'On' : 'Off',
                        heading: feature.heading,
                        speed: feature.speed,
                        currentPosition: feature.current_position,
                    });
                    let iconSrc = '../assets/img/map/Dot_Radar_Red.png';
                    if (feature.engine_status === 1) {
                        iconSrc = '../assets/img/map/Dot_Radar_Green.png';
                    }else if (feature.engine_status === 0) {
                        iconSrc = '../assets/img/map/Dot_Radar_Red.png';
                    }
                    const iconStyle = new OlStyle({
                        image: new OlStyleIcon(/** @type {olx.style.IconOptions} */ ({
                            rotation: h,
                            src: iconSrc,
                            scale: 0.04
                          }))
                    });
                    iconFeature.setStyle(iconStyle);
                    this.featuresSource.push(iconFeature);
                }
                this.vectorSource = new OlSourceVector({
                    features: this.featuresSource
                });

                this.vectorLayer = new OlVectorLayer({
                    source: this.vectorSource,
                    updateWhileAnimating: true,
                    updateWhileInteracting: true
                });

                const rasterLayer = new OlTileLayer({
                    source: new OlOSM({
                        url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
                    })
                });

                const gMapProp = {
                    center: new google.maps.LatLng(-2.241578, 117.289277),
                    zoom: 5,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    keyboardShortcuts: false,
                    disableDoubleClickZoom: true,
                    streetViewControl: false,
                    fullscreenControl: false
                };

                const gmap = new google.maps.Map(document.getElementById('gmap'), gMapProp);
                const view = new OlView({
                    center: OlProj.fromLonLat([117.289277, -2.241578]),
                    zoom: 5,
                    maxZoom: 21
                });
                view.on('change:center', function() {
                    const center = OlProj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
                    gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
                });

                view.on('change:resolution', function() {
                    gmap.setZoom(view.getZoom());
                });

                const trafficLayer = new google.maps.TrafficLayer();
                trafficLayer.setMap(gmap);

                const olMapDiv = document.getElementById('olmap');
                this.map = new OlMap({
                    target: olMapDiv,
                    layers: [this.vectorLayer],
                    view: view
                    // controls: new OlCon.defaults().extend([
                    //   new OlFullScreen()
                    // ])
                });
                olMapDiv.parentNode.removeChild(olMapDiv);
                gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);
                this.popUp();
            },
            err => console.error(err)
        );
    }

    popUp(): void {
        const container = document.getElementById('popup');
        const content = document.getElementById('popup-content');
        const closer = document.getElementById('popup-closer');

        this.overlay = new OlOverlay({
            element: document.getElementById('popup-container'),
            positioning: 'bottom-center',
            offset: [0, -10]
        });

        this.map.on('click', (event) => {
            this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
                this.overlay.setPosition();
                this.getVehicleDetail(feature.values_, event);
            });
        });

        this.map.addOverlay(this.overlay);

        console.log(this.map.getLayers());
    }

    track() {
        // this.hideLayer(this.vectorLayer);
        const featuresLineSource = [];
        this.closePopup();
        // test line dummy

        const points = [
            ['-6.9175', '107.6191'], ['-7.2575', '112.7521']
        ];

        const featureLine = new OlFeature({
            geometry: new OlGeomLineString(points)
        });

        featuresLineSource.push(featureLine);

        const sourceLine = new OlSourceVector({
            features: featuresLineSource
        });

        const vectorLine = new OlVectorLayer({
            source: sourceLine,
            updateWhileAnimating: true,
            updateWhileInteracting: true
        });

        this.map.addLayer(vectorLine);
        console.log(this.map.getLayers());

    }

    hideLayer(layer: any) {
        layer.setVisible(false);
    }

    showLayer(layer: any) {
        layer.setVisible(true);
    }

    getVehicleDetail(item: any, event: any): void {
        this.vehicleDetail = item;
        const features = this.map.getFeaturesAtPixel(event.pixel);
        if (features) {
            const coords = features[0].getGeometry().getCoordinates();
            const driverList = '(' + item.driverId + ')' + item.driverName ;

            const popupContent =
            `<div class='pull-right'><span class='fa fa-close' id='closeBtn'></span></div>` +
            `<h6>` + item.vehicleId + `/` + item.platNumber + `</h6>` +
            `<table class='pop-up-table'> 
                <tr>
                    <td>
                        <b>Supir</b>
                        <br>`
                        + driverList +
                    `</td>
                    <td>
                        <b>Kecepatan</b>
                        <br>`
                        + item.speed +
                    `</td>
                </tr>
                <tr>
                    <td>
                        <b>Status Mesin</b>
                        <br>`
                        + item.engineStatus +
                    `</td>
                    <td>
                        <b>Heading</b>
                        <br>`
                        + item.heading +
                        `</td>
                    </td>
                </tr>
                <tr>
                    <td colspan='2'> 
                        <b>Posisi</b>
                        <br>`
                        + item.currentPosition +
                        `</td>
                    </td>
                </tr>
            </table>
            <br>
            <div id="x">
                <button type="button" class="btn btn-sm btn-success" id="trackBtn"> Tracking </button>
            </div>
            `;
            this.overlay.getElement().innerHTML = popupContent;
            this.overlay.setPosition(coords);
            const trackBtn = document.getElementById('trackBtn');
            trackBtn.addEventListener('click', (e: Event) => this.track());
            const closeBtn = document.getElementById('closeBtn');
            closeBtn.addEventListener('click', (e: Event) => this.closePopup());
        }
    }

    closePopup() {
        this.overlay.setPosition(undefined);
        return false;
    }
}
