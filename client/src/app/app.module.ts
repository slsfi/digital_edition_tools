import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatRadioModule, MatIconModule, MatDialogModule, MatDatepickerModule,
   MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { TreeModule } from 'ng2-tree';

import { DropzoneModule } from 'ngx-dropzone-wrapper';

import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { GridPublicationsComponent } from './components/grid-publications/grid-publications.component';
import { GridColumnStatusComponent } from './components/grid-column-status/grid-column-status.component';
import { GridDocumentsComponent } from './components/grid-documents/grid-documents.component';
import { MenuMainComponent } from './components/menu-main/menu-main.component';
import { HeaderComponent } from './components/header/header.component';
import { AppConfigModule } from './modules/app-config.module';
import { registerLocaleData } from '@angular/common';
import localeFi from '@angular/common/locales/fi';
import { ToolPublisherComponent } from './components/tool-publisher/tool-publisher.component';
import { ToolTOCComponent } from './components/tool-toc/tool-toc.component';
import { ToolSelectorComponent } from './components/tool-selector/tool-selector.component';
import { ToolTaggerComponent } from './components/tool-tagger/tool-tagger.component';
import { ToolEditorComponent } from './components/tool-editor/tool-editor.component';
import { ToolFacsimilesComponent } from './components/tool-facsimiles/tool-facsimiles.component';
import { FileDialogComponent } from './components/file-dialog/file-dialog.component';
import { ToolSelectorTabComponent } from './components/tool-selector-tab/tool-selector-tab.component';
import { EditorSelectorTabComponent } from './components/editor-selector-tab/editor-selector-tab.component';
import { LoginComponent } from './components/login/login.component';
import { CanActivateViaAuthGuard } from './guards/can-activate-via-auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { DialogGitComponent } from './components/dialog-git/dialog-git.component';
import { DialogDataComponent } from './components/dialog-data/dialog-data.component';
import { DialogPublicationCollectionComponent } from './components/dialog-publication-collection/dialog-publication-collection.component';
import { GridFacsimilesComponent } from './components/grid-facsimiles/grid-facsimiles.component';
import { GridTextsComponent } from './components/grid-texts/grid-texts.component';
import { DialogFacsimileCollectionComponent } from './components/dialog-facsimile-collection/dialog-facsimile-collection.component';
import { DialogFacsimileComponent } from './components/dialog-facsimile/dialog-facsimile.component';
import { DialogLocationComponent } from './components/dialog-location/dialog-location.component';
import { DialogSubjectComponent } from './components/dialog-subject/dialog-subject.component';
import { DialogTagComponent } from './components/dialog-tag/dialog-tag.component';
import { DialogWorkComponent } from './components/dialog-work/dialog-work.component';

// Set locale
registerLocaleData(localeFi, 'fi');

// Define our routes
const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuMainComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'publisher', component: ToolPublisherComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'toc', component: ToolTOCComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'selector', component: ToolSelectorComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'tagger', component: ToolTaggerComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'editor', component: ToolEditorComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'facsimiles', component: ToolFacsimilesComponent, canActivate: [CanActivateViaAuthGuard]  },
  { path: '',
    redirectTo: '/menu',
    pathMatch: 'full'
  }
];

// Dropzone settings (Dropzone is used when uploading facsimiles)
/*const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
   url: environment.api_url,
   maxFilesize: 50,
   acceptedFiles: 'image/*'
 };*/

@NgModule({
  declarations: [
    AppComponent,
    GridPublicationsComponent,
    GridColumnStatusComponent,
    GridDocumentsComponent,
    ToolPublisherComponent,
    MenuMainComponent,
    HeaderComponent,
    ToolTOCComponent,
    ToolSelectorComponent,
    ToolTaggerComponent,
    ToolEditorComponent,
    ToolFacsimilesComponent,
    FileDialogComponent,
    ToolSelectorTabComponent,
    EditorSelectorTabComponent,
    LoginComponent,
    DialogGitComponent,
    DialogDataComponent,
    DialogPublicationCollectionComponent,
    GridFacsimilesComponent,
    GridTextsComponent,
    DialogFacsimileCollectionComponent,
    DialogFacsimileComponent,
    DialogLocationComponent,
    DialogSubjectComponent,
    DialogTagComponent,
    DialogWorkComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgGridModule.withComponents(
      [GridColumnStatusComponent]
    ),
    AppConfigModule,
    DropzoneModule,
    TreeModule
  ],
  providers: [
    AuthService,
    DataService,
    CanActivateViaAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'fi-FI'
    },
    /*,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }*/
  ],
  entryComponents: [
    DialogGitComponent,
    DialogDataComponent,
    DialogFacsimileCollectionComponent,
    DialogFacsimileComponent,
    DialogLocationComponent,
    DialogSubjectComponent,
    DialogTagComponent,
    DialogWorkComponent,
    DialogPublicationCollectionComponent,
    FileDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
