import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const API_URL = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
   })
};

@Injectable()
export class ApiServiceService {

  constructor(private http: HttpClient) {}

  public getUsername(username: string) {
    return this.http.get(API_URL + '/users?username=' + username);
  }

  public getFeaturesDashboard() {
    return this.http.get(API_URL + '/dashboard', httpOptions);
  }

  public getVehicleDetail(id: number) {
    return this.http.get(API_URL + '/vehicle/' + id, httpOptions);
  }

  public getTrackingDetail(id: number, limit: number) {
    return this.http.get(API_URL + '/vehicle/' + id + limit, httpOptions);
  }

}
