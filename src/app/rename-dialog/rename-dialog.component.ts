/*
  Диалог - Новая папка
 */

import { Component, OnInit, Inject   } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-rename-dialog',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.scss']
})
export class RenameDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<RenameDialogComponent>,
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
