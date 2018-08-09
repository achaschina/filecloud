/*
  Диалог - Новая папка
 */

import { Component, OnInit, Inject   } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-new-dir-dialog',
  templateUrl: './new-dir-dialog.component.html',
  styleUrls: ['./new-dir-dialog.component.scss']
})
export class NewDirDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<NewDirDialogComponent>,
               @Inject (MAT_DIALOG_DATA) public data: any) { }

  onClick() {
    this.dialogRef.close(this.data.path);
  }
  onNoClick() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
