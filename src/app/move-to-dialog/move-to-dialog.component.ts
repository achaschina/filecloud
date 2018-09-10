/*
  Диалог - Новая папка
 */

import {Component, OnInit, Inject, Input, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DirTreeViewComponent } from "../dir-tree-view/dir-tree-view.component";

@Component({
  selector: 'app-move-to-dialog',
  templateUrl: './move-to-dialog.component.html',
  styleUrls: ['./move-to-dialog.component.scss']
})

export class MoveToDialogComponent implements OnInit {

  @ViewChild(DirTreeViewComponent)
  public dirTreeViewComponent: DirTreeViewComponent;

  constructor( public dialogRef: MatDialogRef<MoveToDialogComponent>,
               @Inject (MAT_DIALOG_DATA) public data: any) { }

  onClick(path: string) {
    this.data.path = path;
    this.dialogRef.close(this.data.path);
  }
  onNoClick() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
