/*
  Основной компонент для обработки ресурсов пользователя
 */

import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialog, MatMenuTrigger, MatSort, MatTableDataSource } from '@angular/material';
import { NewDirDialogComponent } from '../new-dir-dialog/new-dir-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { Resource } from '../../models/IResource';

export interface PathElement {
  id: number;
  name: string;
}

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})

export class ResourcesComponent implements OnInit {

  searchControl = new FormControl();
  public searchOptions: string[] = ['Файлы PDF:', 'Текстовые документы:', 'Таблицы:', 'Презентации:', 'Изображения:', 'Видео:'];

  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Resource>(this.allowMultiSelect, this.initialSelection);

  public displayedColumns: string[] = ['select', 'type', 'name', 'owner', 'modified',  'size'];

  resources: Resource[] = [];
  dirItems: Resource[] = [];
  dirTable;
  selectedFile: Resource;

  private dir = '/';

  private pathRouter: string[] = [];
  mapRoute: PathElement[] = [];

  private currentdir = '/';
  private currentUser = 'admin@mail.com';

  newDirPath = '';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatMenuTrigger) triggerContext: MatMenuTrigger;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private zone: NgZone
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

  // Возвращает текущую папку
  getCurrentPath(): string {
    const result = this.currentdir;
    return result;
  }
  // Диалог создания новой папки
  openNewDirDialog(): void {
    const dialogRef = this.dialog.open(NewDirDialogComponent, {
      width: '500px',
      data: { path: this.newDirPath  }
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

  // Скачивание файла
  downloadFile(): void {
    if (!this.selection.isEmpty()) {
      this.apiService.downloadFiles(this.selection, this.currentdir, this.currentUser);
      return;
    }
    this.selectedFile.type === 'dir' ? this.apiService.downloadFolder(this.selectedFile.path, this.currentUser) :
                                        this.apiService.downloadFile(this.selectedFile.path, this.currentUser);
  }

  // Удаление файла
  dropFile(): void {
    if (!this.selection.isEmpty()) {
      this.apiService.dropFiles(this.selection, this.currentUser).subscribe(
        (data) => this.getResource()
      );
      return;
    }
    this.apiService.dropFile(this.selectedFile, this.currentUser).subscribe(
      (data) => this.getResource()
    );
  }

  // Получить ресурсы с сервера
  public getResource() {
    this.apiService.getResource(this.currentdir, this.currentUser)
      .subscribe((data: Resource[]) => {
        this.resources = { ... data };
        this.dirItems = [];
        for (const item in this.resources) {
          this.resources[item].created = new Date(this.resources[item].created);
          this.resources[item].updated = new Date(this.resources[item].updated);
          this.dirItems.push(this.resources[item]);
        }
        console.log(this.dirItems);
        this.dirTable = new MatTableDataSource(this.dirItems);
        this.dirTable.sort = this.sort;
        // console.log(this.dirTable);
        this.pathMapping();
      });
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
    // console.log(this.currentdir);
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

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
       this.dirTable.data.forEach(row => this.selection.select(row));
  }

  // Клик по файлу
  selectFile(file: Resource): void {
    this.selectedFile = file;
    console.log(this.selectedFile);
  }

  // Вывод в консоль отладочной информации
  log(info: any) {
    console.log(info);
  }

}
