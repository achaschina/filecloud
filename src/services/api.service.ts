/*
  Сервис взаимодействия с Яндекс.Диск АПИ
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Resource} from '../models/IResource';

const httpOptions = {
  headers: new HttpHeaders({ 'Authorization': 'OAuth AQAAAAAPAYo0AAUhYoql2hOqfUfIt9mB5K0BCVk' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiYandex = 'https://cloud-api.yandex.net:443/v1/disk';
  private limit = '&limit=1000';


  constructor(private httpClient: HttpClient) { }

  // Возвращает файлы и папки пользователя. Формат данных описан в ../models/IResource
  getResource (path: string, sort: string) {
      return this.httpClient.get<Resource>(this.apiYandex + '/resources?path=' + path + this.limit + sort, httpOptions);
  }

  // Создает новую папку
  createDir (path: string) {
    return this.httpClient.put(this.apiYandex + '/resources?path= ' + path, httpOptions);
  }

}
