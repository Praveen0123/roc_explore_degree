import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RoiAggregateDto } from '@app/domain';

@Component({
  selector: 'roc-education-costs',
  templateUrl: './education-costs.component.html',
  styleUrls: ['./education-costs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EducationCostsComponent implements OnInit
{
  @Input() roiAggregateDto: RoiAggregateDto;

  constructor() { }

  ngOnInit(): void
  {
  }

}
