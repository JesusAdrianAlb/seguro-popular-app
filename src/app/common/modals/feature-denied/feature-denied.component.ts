import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-feature-denied',
  templateUrl: './feature-denied.component.html',
  styleUrls: ['./feature-denied.component.scss']
})
export class FeatureDeniedComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<FeatureDeniedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onAccept() {
    this.dialogRef.close();
  }

}
