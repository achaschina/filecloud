/*
  Диалог загрузки файлов на сервер
 */

import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-upload-files-dialog',
  templateUrl: './upload-files-dialog.component.html',
  styleUrls: ['./upload-files-dialog.component.css']
})
export class UploadFilesDialogComponent implements OnInit {

  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  constructor(public dialogRef: MatDialogRef<UploadFilesDialogComponent>,
              @Inject (MAT_DIALOG_DATA) public data: any,
              private apiService: ApiService) {
    this.options = { concurrency: 1, maxUploads: 1000 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }

  onUploadOutput(files): void {
    console.log(files);
  }

  startUpload(files): void {
    console.log(files);
     this.apiService.uploadFiles(files, this.data.path).subscribe(
       (data) => console.log(this.files)
     );
  }

  onClick() {
    this.dialogRef.close();
  }
  onNoClick() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  // Вывод в консоль отладочной информации
  log(info: any) {
    console.log(info);
  }

}
