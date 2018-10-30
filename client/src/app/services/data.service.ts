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

  private toolSource = new BehaviorSubject<string>('menu');
  currentTool = this.toolSource.asObservable();
  api_url = environment.api_url;
  api_url_path = environment.api_url_path;
  public projectName = ''; // environment.project_name;
  public publicationCollection = 0;

  public static Base64DecodeUnicode( stringBase64: string ) {
    return decodeURIComponent(atob(stringBase64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  constructor(private http: HttpClient) { }

  changeTool(tool: string) {
    this.toolSource.next(tool);
  }

  getProjects(): Observable<any>  {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/projects/');
  }

  getPublicationCollections(projectName: string): Observable<any>  {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/publication_collection/list/');
  }

  getPublications(projectName: string, publicationCollection: number): Observable<any>  {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/publication_collection/' + publicationCollection.toString() + '/publications/');
  }

  getDocumentTree(path: string, master: boolean): Observable<any>  {
    // Add slashes to start and end of path string if necessary
    path = this.addSlashesToPath(path);
    // Master path?
    const pathAdd: string = (master === true ? '/master' : '');
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + this.projectName + '/get_tree' + pathAdd + path);
  }

  getDocument(doc: DocumentDescriptor, master: boolean): Observable<any> {
    // Add slashes to start and end of path string if necessary
    const path = this.addSlashesToPath(doc.path);
    // Master path?
    const pathAdd: string = (master === true ? '/master' : '');
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' +
      this.api_url_path + '/' + this.projectName + '/get_file/by_path' + pathAdd + path + doc.name);
  }

  // putDocument(path: string, name: string, document: string, message?: string, force?: boolean) : Observable<any> {
  putDocument(doc: DocumentDescriptor, document: string, master: boolean) : Observable<any> {
    // Add slashes to start and end of path string if necessary
    const path = this.addSlashesToPath(doc.path);
    // Master path?
    const pathAdd: string = (master === true ? '/master' : '');
    // Encode the document as base64
    const documentBase64 = btoa(document);
    // Send the request to the server
    return this.http.put<any>(environment.api_url + '/' +
      this.api_url_path + '/' + this.projectName + '/update_file/by_path' + pathAdd + path + doc.name, { 'file' : documentBase64 });
  }

  addSlashesToPath (path: string): string {
    if (path.length > 0 && !path.startsWith('/')) {
      path = '/' + path;
    }
    if (!path.endsWith('/')) {
      path += '/';
    }
    return path;
  }

}

export interface DocumentDescriptor {
  name: string;
  path: string;
}
