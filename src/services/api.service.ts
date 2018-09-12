/*
  Сервис взаимодействия с АПИ FileCloud server
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface FolderParams {
  path: string;
  email: string;
}

export interface RenameParams {
  path: string;
  email: string;
  newName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiCloud = 'http://localhost:3030/';
  private sectionFiles = 'files/';
  private methodList = 'list/';
  private methodCreateFolder = 'createfolder';
  private methodUpload = 'upload';
  private methodUploadFolder = 'uploadfolder';
  private methodDownload = 'download/';
  private methodDownloadFolder = 'downloadfolder/';
  private methodDownloadFiles = 'downloadfiles';
  private methodDownloadAttache = 'downloadattache/';
  private methodDropFiles = 'dropfiles';
  private methodRename = 'rename';
  private methodMove = 'movefiles';
  private methodCopy = 'copyfiles';

  constructor(private httpClient: HttpClient) { }

  // Возвращает файлы и папки пользователя. Формат данных описан в ../models/IResource
  getResource (path: string, email: string, sort: string) {
      const getUrl = this.apiCloud + this.sectionFiles + this.methodList + email + '/' + sort + '/' + path;
      console.log(getUrl);
      return this.httpClient.get(getUrl);
  }

  // Создает новую папку
  createDir (path: string, email: string): Observable<FolderParams> {
    const putUrl = this.apiCloud + this.sectionFiles + this.methodCreateFolder;
    const folder: FolderParams = {
      path: path,
      email: email
    };
    return this.httpClient.post<FolderParams>(putUrl, folder, {
      headers: { 'Content-Type': 'application/json' },
      params: {
        path: path,
        email: email
      }
    });
  }

  // Загрузка файла
  uploadFiles (files, path, currentUser) {
    console.log(files);
    const putUrl = this.apiCloud + this.sectionFiles + this.methodUpload;
    const formData = new FormData();
    for (const file of files) {
      formData.append('file', file,  file.name);
    }
    formData.append('filePath', path);
    formData.append('email', currentUser);
    return this.httpClient.post(putUrl, formData);
  }

  // Загрузка папки
  uploadFolder (files, path, currentUser) {
    const putUrl = this.apiCloud + this.sectionFiles + this.methodUploadFolder;
    const formData = new FormData();
    console.log(files);
    for (const file of files) {
      formData.append('files', file, file.webkitRelativePath);

    }
    formData.append('folderPath', path);
    formData.append('email', currentUser);
    console.log(path + ' ' + currentUser);
    return this.httpClient.post(putUrl, formData);
  }

  // Скачивание файла
  downloadFile(file, currentUser) {
    const getUrl = this.apiCloud + this.sectionFiles + this.methodDownload + currentUser + file;
    console.log(getUrl);
    window.open(getUrl);
    return this.httpClient.get(getUrl);
  }

  // Скачивание группы файлов\папок
  downloadFiles(files, path: string, currentUser) {
    console.log(files._selected);
    const putUrl = this.apiCloud + this.sectionFiles + this.methodDownloadFiles;
    const downloadUrl = this.apiCloud + this.sectionFiles + this.methodDownloadAttache + currentUser + '/temp/attachment.zip';
    const formData = new FormData();
    formData.append('folderPath', path);
    formData.append('email', currentUser);
    for (const file of files._selected) {
      console.log(file.name, file.path);
      formData.append('files', file.path);
    }
    this.httpClient.post(putUrl, formData).subscribe(
      () =>  window.open(downloadUrl));
  }

  // Скачивание папки
  downloadFolder(folder, currentUser) {
    const getUrl = this.apiCloud + this.sectionFiles + this.methodDownloadFolder + currentUser + folder;
    console.log(getUrl);
    window.open(getUrl);
    return this.httpClient.get(getUrl);
  }

  // Переименование файла\папки
  renameItem(file, currentUser: string, newName: string){
    const putUrl = this.apiCloud + this.sectionFiles + this.methodRename;
    const renameFile: RenameParams = {
      path: file,
      email: currentUser,
      newName: newName
    };
    return this.httpClient.post<RenameParams>(putUrl, renameFile, {
      headers: { 'Content-Type': 'application/json' },
      params: {
        path: file,
        email: currentUser,
        newName: newName
      }
    });
  }

  // Удаление папок\файлов
  dropFiles(files, currentUser, oneItem: boolean) {
    const putUrl = this.apiCloud + this.sectionFiles + this.methodDropFiles;
    const formData = new FormData();
    formData.append('email', currentUser);

    if (oneItem) {
      console.log(files);
      formData.append('files', files.path);
    } else {
      for (const file of files._selected) {
        formData.append('files', file.path);
      }
    }
    return this.httpClient.post(putUrl, formData);
  }

  // Перемещение файлов\папок
  moveFiles(pathTo: string, files, currentUser, oneItem: boolean){
    const putUrl = this.apiCloud + this.sectionFiles + this.methodMove;
    const formData = new FormData();
    formData.append('folderPath', pathTo);
    formData.append('email', currentUser);

    if (oneItem) {
      formData.append('files', files);
    } else {
      for (const file of files._selected) {
        formData.append('files', file.path);
      }
    }

    return this.httpClient.post(putUrl, formData);
  }

  // Копирование папок\файлов
  copyFiles(pathTo: string, files, currentUser, oneItem: boolean){
    const putUrl = this.apiCloud + this.sectionFiles + this.methodCopy;
    const formData = new FormData();
    formData.append('folderPath', pathTo);
    formData.append('email', currentUser);

    if (oneItem) {
      formData.append('files', files);
    } else {
      for (const file of files._selected) {
        formData.append('files', file.path);
      }
    }

    return this.httpClient.post(putUrl, formData);
  }


  /*
    В разработке
  // Возвращает корзину
  getTrashResource (path: string, sort: string) {
    return this.httpClient.get<Resource>(this.apiCloud + '/trash/resources?path=' + path + this.limit + sort, httpOptions);
  }*/


}
