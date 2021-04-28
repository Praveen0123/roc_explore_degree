import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RoiAggregateDto } from '@app/domain';

@Component({
  selector: 'roc-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstitutionComponent implements OnInit
{
  @Input() roiAggregateDto: RoiAggregateDto;

  constructor() { }

  ngOnInit(): void
  {
  }

}
