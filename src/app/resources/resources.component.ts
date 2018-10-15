/*
  Основной компонент для обработки ресурсов пользователя
 */

import { Component, NgZone, OnInit, ViewChild, QueryList, ViewChildren, ViewContainerRef, ElementRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialog, MatMenuTrigger, MatSort, MatTableDataSource } from '@angular/material';
import { NewDirDialogComponent } from '../new-dir-dialog/new-dir-dialog.component';
import { RenameDialogComponent } from "../rename-dialog/rename-dialog.component";
import { MoveToDialogComponent } from "../move-to-dialog/move-to-dialog.component";
import { SelectionModel } from '@angular/cdk/collections';
import { Resource } from '../../models/IResource';
import { DirTreeViewComponent } from "../dir-tree-view/dir-tree-view.component";
import { ShareFilesComponent } from '../share-files/share-files.component';
import { TemplatePortalDirective, Portal, ComponentPortal } from '@angular/cdk/portal'
import {Overlay, OverlayConfig} from '@angular/cdk/overlay';

export interface PathElement {
  id: number;
  name: string;
}

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})

export class ResourcesComponent implements OnInit {
  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Resource>(this.allowMultiSelect, this.initialSelection);

  public displayedColumns: string[] = ['select', 'type', 'name', 'owner', 'modified', 'size'];
  public displayedColumnsAvailable: string[] = ['select', 'name', 'owner', 'modified'];

  resources: Resource[] = [];
  dirItems: Resource[] = [
    {
      id: 5,
      fileUid: '5',
      name: 'doctype',
      path: 'filepath',
      size: 125,
      created: new Date(),
      updated: new Date(),
      extension: 'alala',
      type: 'doc',
      folder: false
    },
    {
      id: 6,
      fileUid: '6',
      name: 'pdffile',
      path: 'filepath',
      size: 125,
      created: new Date(),
      updated: new Date(),
      extension: '',
      type: 'pdf',
      folder: true
    }
  ];
  filtredArr: Resource[];
  visible: boolean = false;
  firstState: boolean = false;
  dirTable;
  selectedFile: Resource;
  itemsDetail;
  fileName;

  private dir = '/';

  private pathRouter: string[] = [];
  mapRoute: PathElement[] = [];

  private currentdir = '/';
  private currentUser = 'admin@mail.com';
  private currentSort = 'fileasc';

  newDirPath = '';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatMenuTrigger) triggerContext: MatMenuTrigger;
  @ViewChild(DirTreeViewComponent)
  @ViewChildren(TemplatePortalDirective) templatePortals: QueryList<Portal<any>>;
  @ViewChild('overlayTarget') overlayTarget: ElementRef;
  public dirTreeViewComponent: DirTreeViewComponent;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private zone: NgZone,
    public overlay: Overlay, 
    public viewContainerRef: ViewContainerRef
  ) {
    this.zone.runOutsideAngular(() => {
      document.addEventListener('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
      });
    });
  }

  ngOnInit() {
    this.getResource();
  }

  //Открывает панель "поделиться файлом"
  openSharedPanel() {
    let config = new OverlayConfig();

    config.positionStrategy = this.overlay.position()
    .connectedTo(this.overlayTarget,
      {originX: 'start', originY: 'bottom'}, 
      {overlayX: 'start', overlayY: 'top'});

    config.hasBackdrop = true;
    config.backdropClass = 'custom-backdropClass'

    let overlayRef = this.overlay.create(config);

    overlayRef.backdropClick().subscribe(() => {
      overlayRef.dispose();
    });
  
    overlayRef.attach(new ComponentPortal(ShareFilesComponent, this.viewContainerRef));
  
  }

  // Возвращает текущую папку
  getCurrentPath(): string {
    const result = this.currentdir;
    return result;
  } 
  // Диалог создания новой папки
  openNewDirDialog(): void {
    const dialogRef = this.dialog.open(NewDirDialogComponent, {
      width: '500px',
      data: { path: this.newDirPath }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      if (result !== undefined) {
        this.newDirPath = result;
        // console.log(this.currentdir + this.newDirPath);
        this.apiService.createDir(this.currentdir + this.newDirPath, this.currentUser).subscribe(
          (data) => this.getResource()
        );
        this.getResource();
      }
    });
  }

  // Открыть диалог переименования
  openRenameDialog(): void {
    const dialogRef = this.dialog.open(RenameDialogComponent, {
      width: '500px',
      data: { path: this.newDirPath }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      if (result !== undefined) {
        this.newDirPath = result;
        // console.log(this.currentdir + this.newDirPath);
        this.apiService.renameItem(this.selectedFile.path, this.currentUser, this.newDirPath).subscribe(
          (data) => this.getResource()
        );
        this.getResource();
      }
    });
  }

  // Открыть диалог перемещения
  openMoveToDialog(): void {
    const dialogRef = this.dialog.open(MoveToDialogComponent, {
      width: '500px',
      data: { path: this.newDirPath }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.newDirPath = result;
        if (!this.selection.isEmpty()) {
          this.apiService.moveFiles(this.newDirPath, this.selection, this.currentUser, false).subscribe(
            (data) => this.getResource()
          );
          this.selection.clear();
          return;
        }
        this.apiService.moveFiles(this.newDirPath, this.selectedFile.path, this.currentUser, true).subscribe(
          (data) => this.getResource()
        );
      }
    });
  }

  // Открыть диалог копирования
  copyToDialog(): void {
    const dialogRef = this.dialog.open(MoveToDialogComponent, {
      width: '500px',
      data: { path: this.newDirPath }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.newDirPath = result;
        if (!this.selection.isEmpty()) {
          this.apiService.copyFiles(this.newDirPath, this.selection, this.currentUser, false).subscribe(
            (data) => this.getResource()
          );
          this.selection.clear();
          return;
        }
        this.apiService.copyFiles(this.newDirPath, this.selectedFile.path, this.currentUser, true).subscribe(
          (data) => this.getResource()
        );
      }
    });
  }

  // Загрузка файлов
  filesUpload(files): void {
    console.log(files);
    this.apiService.uploadFiles(files, this.currentdir, this.currentUser).subscribe(
      (data) => this.getResource()
    );
  }

  // Загрузка папки
  folderUpload(files): void {
    console.log(files);
    this.apiService.uploadFolder(files, this.currentdir, this.currentUser).subscribe(
      (data) => this.getResource()
    );

  }

  // Скачивание файла\группы файлов\папок
  downloadFile(): void {
    if (!this.selection.isEmpty()) {
      this.apiService.downloadFiles(this.selection, this.currentdir, this.currentUser);
      this.selection.clear();
      return;
    }
    this.selectedFile.type === 'dir' ? this.apiService.downloadFolder(this.selectedFile.path, this.currentUser) :
      this.apiService.downloadFile(this.selectedFile.path, this.currentUser);
  }

  // Удаление файла\группы файлов\папок
  dropFile(): void {
    if (!this.selection.isEmpty()) {
      this.apiService.dropFiles(this.selection, this.currentUser, false).subscribe(
        (data) => this.getResource()
      );
      this.selection.clear();
      return;
    }
    this.apiService.dropFiles(this.selectedFile, this.currentUser, true).subscribe(
      (data) => this.getResource()
    );

  }

  getResourceFromChild(dirTableFiltred) {
    if (dirTableFiltred) {
      this.dirTable = new MatTableDataSource(dirTableFiltred)
    }
  }

  // Получить ресурсы с сервера
  public getResource() {
    console.log(this.dirItems);
    this.dirTable = new MatTableDataSource(this.dirItems);
    this.selectedFile = undefined;
    this.selection.clear();
    // this.dirTable.sort = this.sort;
    // console.log(this.dirTable);
    this.pathMapping();


    // this.apiService.getResource(this.currentdir, this.currentUser, this.currentSort)
    //   .subscribe((data: Resource[]) => {
    //     this.resources = { ... data };
    //     this.dirItems = [];
    //     for (const item in this.resources) {
    //       this.resources[item].created = new Date(this.resources[item].created);
    //       this.resources[item].updated = new Date(this.resources[item].updated);
    //       this.dirItems.push(this.resources[item]);
    //     }
    //     console.log(this.dirItems);
    //     this.dirTable = new MatTableDataSource(this.dirItems);
    //     this.selectedFile = undefined;
    //     this.selection.clear();
    //     // this.dirTable.sort = this.sort;
    //     // console.log(this.dirTable);
    //     this.pathMapping();
    //   });
  }

  // Текущий путь в массив
  private pathMapping() {
    this.pathRouter = this.currentdir.split('/');
    this.mapRoute = [];
    let i = 0;
    for (const path of this.pathRouter) {
      if (path.length > 0) {
        this.mapRoute.push({
          id: i,
          name: path
        });
        i++;
      }
    }
  }

  // Текущий путь из массива
  public currentDir(index: number) {
    this.currentdir = '';
    for (const path of this.mapRoute) {
      this.currentdir = this.currentdir + this.dir + path.name;
      if (path.id === index) { break; }
    }
    this.currentdir += this.dir;
    this.getResource();
  }

  // Перейти к папке
  public goPath(path: string, type: string) {
    if (type !== 'dir') { return; }
    path === '/' ? this.currentdir = path : this.currentdir = this.currentdir + path + this.dir;
    this.getResource();
  }

  // Навигация Назад
  public goBack() {
    if (this.currentdir === '/') { return; }
    const lastdir = this.currentdir.slice(0, this.currentdir.length - 1).lastIndexOf('/');
    this.currentdir = this.currentdir.slice(0, lastdir + 1);
    this.getResource();
  }

  // Выделение всех папок и файлов
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dirTable.data.length;
    return numSelected === numRows;
  }

  // Тип файла -> Иконка
  getNameByType(type) {
    if (type === 'dir') { return 'dir'; }
    return 'anyfile';
  }

  // Установить способ сортировки
  setSort(column: string): void {
    if (column === 'name') {
      this.currentSort = this.currentSort === 'fileasc' ? 'filedesc' : 'fileasc';
    }
    if (column === 'date') {
      this.currentSort = this.currentSort === 'updateasc' ? 'updatedesc' : 'updateasc';
    }
    if (column === 'size') {
      this.currentSort = this.currentSort === 'sizeasc' ? 'sizedesc' : 'sizeasc';
    }
    this.getResource();
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dirTable.data.forEach(row => this.selection.select(row));
  }

  // Клик по файлу
  selectFile(file: Resource): void {
    this.selectedFile = file;
  }

  // Событие при клике по папке в Дереве папок
  onPathed(path: string) {
    if (path === 'Мой диск:/') path = '/';
    this.currentdir = path;
    this.getResource();
  }
  
  //Событие при клике для просмотра деталей файла
  showFilesProperties(item: any) {
    this.visible = true;
    let detailView = {};
    let resultArr = [];
    detailView["Тип"] = item.type;
    detailView["Размер"] = item.size;
    detailView["Расположение"] = item.path;
    detailView["Владелец"] = "я";
    detailView["Изменено"] = item.updated;
    detailView["Создано"] = item.created;

    console.log(item);

    for (let prop in detailView) {
      let arr = [];
      arr.push(prop);
      if (detailView[prop] instanceof Date) {

        let options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        };

        arr.push(detailView[prop].toLocaleString("ru", options));

      } else {

        arr.push(detailView[prop]);

      }

      resultArr.push(arr);
    }


    this.itemsDetail = resultArr;
    this.fileName = item.name + '.' + item.type;
    this.firstState = false;
  }

  showFilesPropertiesForm() {
    this.visible = !this.visible;
    this.firstState = true;
  }

  dirTableAvailable:  Resource[]; //массив расшаренных файлов
  // showAvailable: boolean = false
  // @Output() dirTableAvailable = new EventEmitter();

  availableToMe() {
    this.dirTableAvailable = [
      {
        id: 111,
        fileUid: '111',
        name: 'docfile11111',
        path: 'filepath',
        size: 1.5,
        created: new Date(),
        updated: new Date(),
        extension: '',
        type: 'doc',
        folder: false
      },
      {
        id: 644444,
        fileUid: '644444',
        name: 'pdffile44444',
        path: 'filepath',
        size: 7.5,
        created: new Date(),
        updated: new Date(),
        extension: '',
        type: 'pdf',
        folder: false
      }
    ];
    this.dirTable = new MatTableDataSource(this.dirTableAvailable)
  }

  // Вывод в консоль отладочной информации
  log(info: any) {
    console.log(info);
  }
}
