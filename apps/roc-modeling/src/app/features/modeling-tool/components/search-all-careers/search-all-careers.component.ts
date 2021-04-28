import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'roc-search-all-careers',
  templateUrl: './search-all-careers.component.html',
  styleUrls: ['./search-all-careers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchAllCareersComponent implements OnInit
{

  constructor(
    public dialogRef: MatDialogRef<SearchAllCareersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void
  {
  }
  // CLOSE DIALOG WITH CLOSE ICON
  close(): void
  {
    this.dialogRef.close();
  }

}
