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
  currentToolObservable = this.toolSource.asObservable();
  private headerSource = new BehaviorSubject<string>('');
  public headerObservable = this.headerSource.asObservable();
  api_url = environment.api_url;
  api_url_path = environment.api_url_path;
  private projectSource = new BehaviorSubject<string>(environment.project_default);
  public projectNameObservable = this.projectSource.asObservable();
  public projectName = environment.project_default;
  public publicationCollection = 0;
  public publication = 0;
  // The variables below are used to "cache" data received from the server
  public dataFacsimileCollections: any;
  public dataSubjects: any;
  public dataLocations: any;
  public dataDocuments: any;

  public static Base64DecodeUnicode( stringBase64: string ) {
    return decodeURIComponent(atob(stringBase64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  constructor(private http: HttpClient) { 
    // Check if project name is in local storage (browser)
    if(localStorage.getItem("projectName")) {
      this.projectName = localStorage.getItem("projectName");
      this.projectSource.next(this.projectName);
    }
  }

  // ---------------------------------------
  // BehaviorSubject methods (to automatically update headers etc.)
  // ---------------------------------------
  changeTool(tool: string) {
    this.toolSource.next(tool);
    this.headerSource.next('');
  }

  changeHeader(header: string) {
    this.headerSource.next(header);
  }

  // ---------------------------------------
  // Projects
  // ---------------------------------------
  getProjects(): Observable<any>  {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/projects/');
  }

  addProject(project: DataItemDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/projects/new/', {'name': project.title});
  }

  editProject(project: DataItemDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/projects/' + project.id + '/edit/', {'name': project.title});
  }

  setProject(projectName: string) {
    // Set projectName and observable
    this.projectName = projectName;
    this.projectSource.next(projectName);
    // Set local storage variable for next session
    localStorage.setItem("projectName", this.projectName);
    // Clear documents (git)
    this.dataDocuments = undefined;
    // Reset any other variables here that are project dependant
  }


  // ---------------------------------------
  // Publication Collections
  // ---------------------------------------
  getPublicationCollections(projectName: string): Observable<any>  {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/publication_collection/list/');
  }

  addPublicationCollection(projectName: string, collection: DataItemDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/publication_collection/new/', {'name': collection.title, 'datePublishedExternally': collection.date, 'published': 0});
  }

  editPublicationCollection(projectName: string, collection: DataItemDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/publication_collection/' + collection.id + '/edit/', {'name': collection.title, 'datePublishedExternally': collection.date});
  }

  setPublicationCollectionTitle(projectName: string, collection: DataItemDescriptor) {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/publication_collection/' + collection.id + '/title/edit/', {'filename': collection.fileName});
  }

  setPublicationCollectionIntro(projectName: string, collection: DataItemDescriptor) {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/publication_collection/' + collection.id + '/intro/edit/', {'filename': collection.fileName});
  }


  // ---------------------------------------
  // Publications
  // ---------------------------------------

  getPublications(projectName: string, publicationCollection: number): Observable<any>  {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/publication_collection/' + publicationCollection.toString() + '/publications/');
  }

  getPublication(projectName: string, publication: number ): Observable<any>  {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/publication/' + publication.toString() + '/');
  }

  addPublication(projectName: string, publicationCollection: number, publication: DataItemDescriptor): Observable<any> {
    let data = {};
    if(publication.title !== undefined)
      data['name'] = publication.title;
    if(publication.genre !== undefined)
      data['genre'] = publication.genre;
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName +  '/publication_collection/' + publicationCollection.toString() + '/publications/new/', data);
  }

  editPublication(projectName: string, publication: DataItemDescriptor): Observable<any> {
    let data = {};
    if(publication.title !== undefined)
      data['title'] = publication.title;
    if(publication.genre !== undefined)
      data['genre'] = publication.genre;
    if(publication.fileName !== undefined)
      data['filename'] = publication.fileName;
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/publication/' + publication.id.toString() + '/edit/', data);
  }


  // ---------------------------------------
  // Manuscripts
  // ---------------------------------------

  getManuscripts(projectName: string, publicationCollection: number, publication: number): Observable<any>  {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/text/' + publicationCollection.toString() + '/' + publication.toString() + '/ms/');
  }


  // ---------------------------------------
  // Versions
  // ---------------------------------------

  getVersions(projectName: string, publicationCollection: number, publication: number): Observable<any>  {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/text/' + publicationCollection.toString() + '/' + publication.toString() + '/var/');
  }


  // ---------------------------------------
  // Facsimiles
  // ---------------------------------------

  addFacsimileCollection(projectName: string, collection: FacsimileCollectionDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName +  '/facsimile_collection/new/', collection);
  }

  editFacsimileCollection(projectName: string, collection: FacsimileCollectionDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName +  '/facsimile_collection/' + collection.id + '/edit/', collection);
  }

  getFacsimileCollections(projectName: string): Observable<any> {
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/facsimile_collection/list/');
  }

  getFacsimiles(projectName: string, publication: number): Observable<any> {
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/publication/' + publication + '/facsimiles/');
  }


  // ---------------------------------------
  // Metadata
  // ---------------------------------------

  getLocations(): Observable<any> {
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/locations/');
  }

  getSubjects(): Observable<any> {
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/subjects/');
  }


  // ---------------------------------------
  // Documents (GIT)
  // ---------------------------------------

  // Get a document tree from the server
  getDocumentTree(path: string, master: boolean): Observable<any>  {
    // Add slashes to start and end of path string if necessary
    path = this.addSlashesToPath(path);
    // Master path?
    const pathAdd: string = (master === true ? '/master' : '');
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + this.projectName + '/get_tree' + pathAdd + path);
  }

  // Get a document from the server
  getDocument(doc: DocumentDescriptor, master: boolean): Observable<any> {
    // Add slashes to start and end of path string if necessary
    const path = this.addSlashesToPath(doc.path);
    // Master path?
    const pathAdd: string = (master === true ? '/master' : '');
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' +
      this.api_url_path + '/' + this.projectName + '/get_file/by_path' + pathAdd + path + doc.name);
  }

  // Upload a document to the server
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

  // Add leading and trailing slashes to a path string
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

export enum ChildEventType {
  Add,
  Edit,
  Remove,
  LinkFile
}

export interface ChildEvent {
  type: ChildEventType,
  data?: any;
}

export interface DocumentDescriptor {
  name: string;
  path: string;
}

export enum DataItemType {
  Project,
  PublicationCollection,
  Publication,
  FacsimileCollection,
  Facsimile
}

export interface DataItemDescriptor {
  type: DataItemType;
  id?: number;
  title?: string;
  date?: string;
  published?: boolean;
  genre?: string;
  fileName?: string;
  data?: any;
}

export interface FacsimileCollectionDescriptor {
  id?: number;
  title?: string;
  description?: string;
  folderPath?: string;
  numberOfPages?: number;
  startPageNumber?: number;
}

export interface FacsimileDescriptor {
  id?: number;
  facsimileCollectionId?: number;
  title?: string;
  page?: number;
}

export interface PublicationCollectionDescriptor {
  id: number;
  title: string;
  published: boolean;
}

export interface PublicationDescriptor {
  id: number;
  title: string;
  published: boolean;
}
