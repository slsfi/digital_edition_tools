import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatIconModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';
import { AppComponent } from './app.component';
import { DataService } from "./services/data.service";
import { GridPublicationsComponent } from "./components/grid-publications/grid-publications.component";
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

// Set locale
registerLocaleData(localeFi, 'fi');

// Define our routes
const appRoutes: Routes = [
  { path: 'menu', component: MenuMainComponent },
  { path: 'publisher', component: ToolPublisherComponent },
  { path: 'menus', component: ToolMenusComponent },
  { path: 'selector', component: ToolSelectorComponent },
  { path: 'tagger', component: ToolTaggerComponent },
  { path: 'facsimiles', component: ToolFacsimilesComponent },
  { path: '',
    redirectTo: '/menu',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    GridPublicationsComponent,
    GridColumnStatusComponent,
    ToolPublisherComponent,
    MenuMainComponent,
    HeaderComponent,
    ToolMenusComponent,
    ToolSelectorComponent,
    ToolTaggerComponent,
    ToolFacsimilesComponent,
    FileDialogComponent,
    ToolSelectorTabComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
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
    AppConfigModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
