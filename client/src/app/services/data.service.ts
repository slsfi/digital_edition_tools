import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DataService {

  private toolSource = new BehaviorSubject<string>("menu");
  currentTool = this.toolSource.asObservable();
  api_url: string = environment.api_url;

  constructor(private http: HttpClient) { }

  changeTool(tool: string) {
    this.toolSource.next(tool);
  }

}
