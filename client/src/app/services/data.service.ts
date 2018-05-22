import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private toolSource = new BehaviorSubject<string>("menu");
  currentTool = this.toolSource.asObservable();

  constructor() { }

  changeTool(tool: string) {
    this.toolSource.next(tool);
  }

}
