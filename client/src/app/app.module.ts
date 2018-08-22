import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatIconModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular/main';

import { DropzoneModule } from 'ngx-dropzone-wrapper';

import { AppComponent } from './app.component';
import { AuthService } from "./services/auth.service";
import { DataService } from "./services/data.service";
import { GridPublicationsComponent } from "./components/grid-publications/grid-publications.component";
import { GridDocumentsComponent } from "./components/grid-documents/grid-documents.component";
import { GridColumnStatusComponent } from "./components/grid-column-status/grid-column-status.component";
import { MenuMainComponent } from './components/menu-main/menu-main.component';
import { HeaderComponent } from './components/header/header.component';
import { AppConfigModule } from './modules/app-config.module';
import { registerLocaleData } from '@angular/common';
import localeFi from '@angular/common/locales/fi';
import { ToolPublisherComponent } from './components/tool-publisher/tool-publisher.component';
import { ToolMenusComponent } from './components/tool-menus/tool-menus.component';
import { ToolSelectorComponent } from './components/tool-selector/tool-selector.component';
import { ToolTaggerComponent } from './components/tool-tagger/tool-tagger.component';
import { ToolFacsimilesComponent } from './components/tool-facsimiles/tool-facsimiles.component';
import { FileDialogComponent } from './components/file-dialog/file-dialog.component';
import { ToolSelectorTabComponent } from './components/tool-selector-tab/tool-selector-tab.component';
import { LoginComponent } from './components/login/login.component';
import { CanActivateViaAuthGuard } from './guards/can-activate-via-auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';

// Set locale
registerLocaleData(localeFi, 'fi');

// Define our routes
const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuMainComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'publisher', component: ToolPublisherComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'menus', component: ToolMenusComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'selector', component: ToolSelectorComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'tagger', component: ToolTaggerComponent, canActivate: [CanActivateViaAuthGuard] },
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
    GridDocumentsComponent,
    GridColumnStatusComponent,
    ToolPublisherComponent,
    MenuMainComponent,
    HeaderComponent,
    ToolMenusComponent,
    ToolSelectorComponent,
    ToolTaggerComponent,
    ToolFacsimilesComponent,
    FileDialogComponent,
    ToolSelectorTabComponent,
    LoginComponent
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
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    AgGridModule.withComponents(
      [GridColumnStatusComponent]
    ),
    AppConfigModule,
    DropzoneModule
  ],
  providers: [
    AuthService,
    DataService,
    CanActivateViaAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }/*,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
