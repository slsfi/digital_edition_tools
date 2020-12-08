import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from "../../services/auth.service";
import { DataService } from "../../services/data.service";
import { environment } from '../../../environments/environment';
import { DropzoneComponent , DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-tool-facsimiles',
  templateUrl: './tool-facsimiles.component.html',
  styleUrls: ['./tool-facsimiles.component.css']
})
export class ToolFacsimilesComponent implements OnInit {

  // Dropzone configuration (not using a global configuration)
  public config: DropzoneConfigInterface = {
    url: environment.api_url,
    headers: {'Authorization': 'Bearer '},
    maxFilesize: 50,
    acceptedFiles: 'image/*',
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };

  private subscription: Subscription;

  constructor(private auth: AuthService, private data: DataService) { }

  ngOnInit() {
    this.data.changeTool('Facsimiles');
    // subcribe to the access token
    /*this.subscription = this.auth.accessToken.subscribe(item => {
      this.config.headers = {'Authorization': 'Bearer '+item};
    });*/
  }

}
