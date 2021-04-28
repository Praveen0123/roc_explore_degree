import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RoiAggregateDto } from '@app/domain';

@Component({
  selector: 'roc-future-earnings',
  templateUrl: './future-earnings.component.html',
  styleUrls: ['./future-earnings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FutureEarningsComponent implements OnInit
{

  @Input() roiAggregateDto: RoiAggregateDto;

  constructor() { }

  ngOnInit(): void
  {
  }

}
