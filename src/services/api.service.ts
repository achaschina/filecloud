/*
  Сервис взаимодействия с АПИ FileCloud server
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';


export interface FolderParams {
  path: string;
  email: string;
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

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
  private methodDownload = 'download/'


  constructor(private httpClient: HttpClient) { }

  // Возвращает файлы и папки пользователя. Формат данных описан в ../models/IResource
  getResource (path: string, email: string) {
      const getUrl = this.apiCloud + this.sectionFiles + this.methodList + email + path;
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
    for (const file of files) {
      formData.append('files', file, file.webkitRelativePath);
    }
    formData.append('folderPath', path);
    formData.append('email', currentUser);
    return this.httpClient.post(putUrl, formData);
  }

  // Скачивание файла
  downloadFile(file, currentUser) {
    const getUrl = this.apiCloud + this.sectionFiles + this.methodDownload + currentUser + file;
    console.log(getUrl);
    window.open(getUrl);
    return this.httpClient.get(getUrl);
  }

  /*
    В разработке
  // Возвращает корзину
  getTrashResource (path: string, sort: string) {
    return this.httpClient.get<Resource>(this.apiCloud + '/trash/resources?path=' + path + this.limit + sort, httpOptions);
  }


   */


}
