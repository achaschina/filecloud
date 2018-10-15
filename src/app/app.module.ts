import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ResourcesComponent } from './resources/resources.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatSortModule, MatSelectModule, MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { MatTableModule, MatTabsModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NewDirDialogComponent } from './new-dir-dialog/new-dir-dialog.component';
import { RenameDialogComponent } from "./rename-dialog/rename-dialog.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DirTreeViewComponent } from './dir-tree-view/dir-tree-view.component';
import { MoveToDialogComponent } from "./move-to-dialog/move-to-dialog.component";
import { SearchFormComponent } from './search-form/search-form.component';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ShareFilesComponent } from './share-files/share-files.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { SharedOverlayComponent } from './shared-overlay/shared-overlay.component';
import { AccountComponent } from './account/account.component';
import { NewAccountComponent } from './account/new-account/new-account.component';

@NgModule({
  declarations: [
    AppComponent,
    ResourcesComponent,
    NewDirDialogComponent,
    SearchFormComponent,
    DirTreeViewComponent,
    RenameDialogComponent,
    MoveToDialogComponent,
    SearchFormComponent,
    DetailFormComponent,
    SearchBarComponent,
    ShareFilesComponent,
    SharedOverlayComponent,
    AccountComponent,
    NewAccountComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    FormsModule,
    MatSortModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatDividerModule,
    MatSidenavModule,
    MatTreeModule,
    MatProgressBarModule,
    MatCardModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    OverlayModule,
    A11yModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [NewDirDialogComponent, 
                    RenameDialogComponent, 
                    MoveToDialogComponent, 
                    SearchFormComponent, 
                    ShareFilesComponent,
                    AccountComponent,
                    NewAccountComponent]
})

export class AppModule { }
