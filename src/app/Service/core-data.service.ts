import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CoreDataService {
  private _baseURL =  "https://localhost:44304";

  private _homeUrl;

  constructor(private http:HttpClient) {
    this._homeUrl = this._baseURL+"/api/getitem";
  }


  public getItem(){
    return this.http.get(this._homeUrl);
  }



}
