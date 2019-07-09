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

  public static Base64DecodeUnicode(stringBase64: string) {
    return decodeURIComponent(atob(stringBase64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  public static Base64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  }

  /*public static Base644EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1);
        }
      )
    );
  }*/

  constructor(private http: HttpClient) {
    // Check if project name is in local storage (browser)
    if (localStorage.getItem('projectName')) {
      this.projectName = localStorage.getItem('projectName');
      this.projectSource.next(this.projectName);
    }
  }

  // ---------------------------------------
  // Common
  // ---------------------------------------
  getPublishedLevelText(publishedLevel: number): string {
    if (publishedLevel == null || publishedLevel < 0 || publishedLevel >= environment.published_levels.length) {
      return environment.published_levels[0].name;
    } else {
      return environment.published_levels[publishedLevel].name;
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
  getProjects(): Observable<any> {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/projects/');
  }

  addProject(project: DataItemDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/projects/new/', { 'name': project.title });
  }

  editProject(project: DataItemDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/projects/' +
      project.id + '/edit/', { 'name': project.title });
  }

  setProject(projectName: string) {
    // Set projectName and observable
    this.projectName = projectName;
    this.projectSource.next(projectName);
    // Set local storage variable for next session
    localStorage.setItem('projectName', this.projectName);
    // Clear documents (git)
    this.dataDocuments = undefined;
    // Reset any other variables here that are project dependant
  }


  // ---------------------------------------
  // Publication Collections
  // ---------------------------------------
  getPublicationCollections(projectName: string): Observable<any> {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/publication_collection/list/');
  }

  getPublicationCollection(projectName: string, collection: DataItemDescriptor): Observable<any> {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName +
      '/publication_collection/' + collection.id.toString() + '/info');
  }

  addPublicationCollection(projectName: string, collection: DataItemDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName +
      '/publication_collection/new/', {
        'name': collection.title, 'datePublishedExternally': collection.date,
        'published': collection.published
      });
  }

  editPublicationCollection(projectName: string, collection: DataItemDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName +
      '/publication_collection/' + collection.id + '/edit/', {
        'name': collection.title, 'datePublishedExternally': collection.date,
        'published': collection.published
      });
  }

  setPublicationCollectionTitle(projectName: string, collection: DataItemDescriptor) {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName +
      '/publication_collection/' + collection.id + '/title/edit/', { 'filename': collection.filename });
  }

  setPublicationCollectionIntro(projectName: string, collection: DataItemDescriptor) {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName +
      '/publication_collection/' + collection.id + '/intro/edit/', { 'filename': collection.filename });
  }


  // ---------------------------------------
  // Publications
  // ---------------------------------------

  getPublications(projectName: string, publicationCollection: number): Observable<any> {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName +
      '/publication_collection/' + publicationCollection.toString() + '/publications/');
  }

  getPublication(projectName: string, publication: number): Observable<any> {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName +
      '/publication/' + publication.toString() + '/');
  }

  addPublication(projectName: string, publicationCollection: number, publication: DataItemDescriptor): Observable<any> {
    const data = {};
    if (publication.title !== undefined) {
      data['name'] = publication.title;
    }
    if (publication.genre !== undefined) {
      data['genre'] = publication.genre;
    }
    if (publication.published !== undefined) {
      data['published'] = publication.published;
    }
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/publication_collection/' +
      publicationCollection.toString() + '/publications/new/', data);
  }

  editPublication(projectName: string, publication: DataItemDescriptor): Observable<any> {
    const data = {};
    if (publication.title !== undefined) {
      data['title'] = publication.title;
    }
    if (publication.genre !== undefined) {
      data['genre'] = publication.genre;
    }
    if (publication.filename !== undefined) {
      data['filename'] = publication.filename;
    }
    if (publication.published !== undefined) {
      data['published'] = publication.published;
    }
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/publication/' + publication.id.toString() + '/edit/', data);
  }

  getComments(projectName: string, publication: number): Observable<any> {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/publication/' + publication.toString() + '/comments/');
  }

  editComments(projectName: string, publication: DataItemDescriptor): Observable<any> {
    const data = {};
    if (publication.filename !== undefined) {
      data['filename'] = publication.filename;
    }
    if (publication.published !== undefined) {
      data['published'] = publication.published;
    }
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/publication/' + publication.id.toString() + '/comment/edit/', data);
  }


  // ---------------------------------------
  // Versions
  // ---------------------------------------

  getVersions(projectName: string, publicationCollection: number, publication: number): Observable<any> {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/text/' + publicationCollection.toString() + '/' + publication.toString() + '/var/');
  }

  addVersion(projectName: string, publication: number, version: DataItemDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/publication/' + publication.toString() + '/versions/new/', version);
  }

  editVersion(projectName: string, version: DataItemDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/versions/' + version.id.toString() + '/edit/', version);
  }


  // ---------------------------------------
  // Manuscripts
  // ---------------------------------------

  getManuscripts(projectName: string, publicationCollection: number, publication: number): Observable<any> {
    // Send the request to the server
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/text/' + publicationCollection.toString() + '/' + publication.toString() + '/ms/');
  }

  addManuscript(projectName: string, publication: number, manuscript: DataItemDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/publication/' + publication.toString() + '/manuscripts/new/', manuscript);
  }

  editManuscript(projectName: string, manuscript: DataItemDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/manuscripts/' + manuscript.id.toString() + '/edit/', manuscript);
  }


  // ---------------------------------------
  // Facsimiles
  // ---------------------------------------

  addFacsimileCollection(projectName: string, collection: FacsimileCollectionDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/facsimile_collection/new/', collection);
  }

  editFacsimileCollection(projectName: string, collection: FacsimileCollectionDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/facsimile_collection/' + collection.id + '/edit/', collection);
  }

  getFacsimileCollections(projectName: string): Observable<any> {
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/facsimile_collection/list/');
  }

  getFacsimiles(projectName: string, publication: number): Observable<any> {
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/publication/' + publication + '/facsimiles/');
  }

  linkFacsimile(projectName: string, facsimile: FacsimileDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/facsimile_collection/' + facsimile.facsimile_collection_id + '/link/', facsimile);
  }

  /*editFacsimile(projectName: string, publication: number, facsimile: FacsimileDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName +
      '/facsimile_collection/' + facsimile.id + '/edit/', facsimile);
  }*/


  // ---------------------------------------
  // Metadata
  // ---------------------------------------

  getLocations(): Observable<any> {
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/locations/');
  }

  addLocation(projectName: string, location: LocationDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/locations/new/', location);
  }

  editLocation(projectName: string, location: LocationDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/locations/' + location.id.toString() + '/edit/', location);
  }

  getSubjects(): Observable<any> {
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/subjects/');
  }

  addSubject(projectName: string, subject: SubjectDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/subjects/new/', subject);
  }

  editSubject(projectName: string, subject: SubjectDescriptor): Observable<any> {
    return this.http.post<any>(environment.api_url + '/' + this.api_url_path + '/' +
      projectName + '/subjects/' + subject.id.toString() + '/edit/', subject);
  }

  // ---------------------------------------
  // Table of Contents
  // ---------------------------------------

  // Get a table of contents file from the server
  getTOC(projectName: string, collection: PublicationCollectionDescriptor): Observable<any> {
    return this.http.get<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/toc/' + collection.id);
  }

  // Save a table of contents file to the server
  putTOC(projectName: string, collection: PublicationCollectionDescriptor, toc: string): Observable<any> {
    // Send the toc with a http request
    return this.http.put<any>(environment.api_url + '/' + this.api_url_path + '/' + projectName + '/toc/' + collection.id, toc,
      httpOptions);
  }

  // ---------------------------------------
  // Documents (GIT)
  // ---------------------------------------

  // Get a document tree from the server
  getDocumentTree(path: string, master: boolean): Observable<any> {
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
  putDocument(doc: DocumentDescriptor, document: string, master: boolean): Observable<any> {
    // Add slashes to start and end of path string if necessary
    const path = this.addSlashesToPath(doc.path);
    // Master path?
    const pathAdd: string = (master === true ? '/master' : '');
    // Encode the document as base64
    const documentBase64 = DataService.Base64EncodeUnicode(document);
    // Send the request to the server
    return this.http.put<any>(environment.api_url + '/' +
      this.api_url_path + '/' + this.projectName + '/update_file/by_path' + pathAdd + path + doc.name, { 'file': documentBase64 },
      httpOptions);
  }

  // Add leading and trailing slashes to a path string
  addSlashesToPath(path: string): string {
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
  type: ChildEventType;
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
  Version,
  Manuscript,
  Comments
}

export interface DataItemDescriptor {
  type: DataItemType;
  id?: number;
  idLinked?: number;
  title?: string;
  date?: string;
  published?: number;
  genre?: string;
  filename?: string;
  sort_order?: number;
  data?: any;
}

export interface LocationDescriptor {
  id?: number;
  legacy_id?: string;
  project_id?: number;
  date_created?: string;
  date_modified?: string;
  deleted?: number;
  name?: string;
  description?: string;
  country?: string;
  region?: string;
  city?: string;
  longitude?: string;
  latitude?: string;
  source?: string;
}

export interface SubjectDescriptor {
  id?: number;
  legacy_id?: string;
  project_id?: number;
  date_created?: string;
  date_modified?: string;
  deleted?: number;
  type?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  preposition?: string;
  description?: string;
  place_of_birth?: string;
  date_born?: string;
  date_deceased?: string;
  occupation?: string;
  source?: string;
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
  type?: DataItemType;
  facsimile_collection_id?: number;
  publication_id?: number;
  version_id?: number;
  manuscript_id?: number;
  title?: string;
  page?: number;
  sort_order?: number;
}

export interface PublicationCollectionDescriptor {
  id: number;
  title: string;
  published: number;
}

export interface PublicationDescriptor {
  id: number;
  title: string;
  published: number;
}

export interface SubjectDescriptor {
  id?: number;
  dateBorn?: string;
  dateDeceased?: string;
  description?: string;
  firstName?: string;
  fullName?: string;
  lastName?: string;
  legacyXMLId?: string;
  preposition?: string;
  type?: string;
}

export interface LocationDescriptor {
  id?: number;
  name?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  legacyXMLId?: string;
}

export interface DialogData {
  success: boolean;
  data: object;
}
