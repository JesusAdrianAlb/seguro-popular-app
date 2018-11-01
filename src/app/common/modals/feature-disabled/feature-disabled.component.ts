import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-feature-disabled',
  templateUrl: './feature-disabled.component.html',
  styleUrls: ['./feature-disabled.component.scss']
})
export class FeatureDisabledComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<FeatureDisabledComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
  }

  onAccept() {
    this.dialogRef.close();
  }

}
