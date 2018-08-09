/*
  Основной компонент для обработки ресурсов пользователя
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Resource } from '../../models/IResource';
import { MatDialog, MatMenuTrigger, MatSort, MatTableDataSource } from '@angular/material';
import { NewDirDialogComponent } from '../new-dir-dialog/new-dir-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})

export class ResourcesComponent implements OnInit {

  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Resource>(this.allowMultiSelect, this.initialSelection);

  public displayedColumns: string[] = ['select', 'type', 'name', 'owner', 'modified',  'size'];

  public resources: Resource;
  public dirItems: any;
  private otvet: any;

  private dir = '/';
  public currentdir = '/';
  private mysort = '&sort=name';

  newDirPath = '';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatMenuTrigger) triggerContext: MatMenuTrigger;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog
  ) {  }

  ngOnInit() {
    this.getResource();
  }

  //Диалог создания новой папки
  openDialog(): void {
    const dialogRef = this.dialog.open(NewDirDialogComponent, {
      width: '500px',
      data: { path: this.newDirPath  }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined) {
        this.newDirPath = result;
        this.otvet = this.apiService.createDir(this.currentdir + this.newDirPath);
        console.log(this.otvet);
        this.getResource();
      }
    });
  }

  //Получить ресурсы с сервера
  public getResource() {
    this.apiService.getResource(this.currentdir, this.mysort)
      .subscribe((data: Resource) => {
        this.resources = { ... data };
        this.previewPrepare();
        this.dirItems = new MatTableDataSource(this.resources._embedded.items);
        this.dirItems.sort = this.sort;
      });
  }

  //Назначение иконок элементам (папкам, файлам)
  private previewPrepare() {
    for (const item of this.resources._embedded.items) {
       //if (item.preview) {
       //  item.preview = item.preview.replace('https:','');
       //  break;
      // }
      item.preview = '../../assets/images/' + item.type + '.png';
    }
    return;
  }

  //Перейти к папке
  public goPath(path: string, type: string) {
    if (type !== 'dir') { return; }
    this.currentdir = this.currentdir + path + this.dir;
    this.getResource();
  }

  //Навигация Назад
  public goBack() {
    if (this.currentdir === '/') { return; }
    const lastdir = this.currentdir.slice(0, this.currentdir.length - 1).lastIndexOf('/');
    this.currentdir = this.currentdir.slice(0, lastdir + 1);
    this.getResource();
  }

  //Сортировка по имени
  public inverseSortName() {
    (this.mysort === '&sort=name') ? this.mysort = '&sort=-name' : this.mysort = '&sort=name';
    this.getResource();
  }

  //Сортировка по дате изменения
  public inverseSortDate() {
    (this.mysort === '&sort=modified') ? this.mysort = '&sort=-modified' : this.mysort = '&sort=modified';
    this.getResource();
  }

  //Сортировка по размеру файла
  public inverseSortSize() {
    (this.mysort === '&sort=size') ? this.mysort = '&sort=-size' : this.mysort = '&sort=size';
    this.getResource();
  }

  //Выделение всех папок и файлов
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dirItems.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dirItems.data.forEach(row => this.selection.select(row));
  }

  openContext() {
    this.triggerContext.openMenu();
  }
}
