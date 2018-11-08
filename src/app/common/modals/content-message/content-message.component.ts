import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-content-message',
  templateUrl: './content-message.component.html',
  styleUrls: ['./content-message.component.scss']
})
export class ContentMessageComponent implements OnInit {

  message = '';
  title = '';

  constructor(private dialogRef: MatDialogRef<ContentMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onAccept() {
    this.dialogRef.close();
  }

}
