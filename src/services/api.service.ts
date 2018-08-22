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
  private section = 'files/';
  private methodList = 'list/';
  private methodCreateFolder = 'createfolder';


  constructor(private httpClient: HttpClient) { }

  // Возвращает файлы и папки пользователя. Формат данных описан в ../models/IResource
  getResource (path: string, email: string) {
      const getUrl = this.apiCloud + this.section + this.methodList + email + path;
      console.log(getUrl);
      return this.httpClient.get(getUrl);
  }

  // Создает новую папку
  createDir (path: string, email: string): Observable<FolderParams> {
    const putUrl = this.apiCloud + this.section + this.methodCreateFolder;
    const folder: FolderParams = {
      path: path,
      email: email
    }
    return this.httpClient.post<FolderParams>(putUrl, folder, {
      headers: { 'Content-Type': 'application/json' },
      params: {
        path: path,
        email: email
      }
    });
  }

  /*
    В разработке
  // Возвращает корзину
  getTrashResource (path: string, sort: string) {
    return this.httpClient.get<Resource>(this.apiCloud + '/trash/resources?path=' + path + this.limit + sort, httpOptions);
  }


  // Создает новую папку
  createDir (path: string) {
    return this.httpClient.put(this.apiCloud + '/resources?path=' + path, httpOptions);
  }

   */


}
