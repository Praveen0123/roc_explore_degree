import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RoiAggregateDto } from '@app/domain';

@Component({
  selector: 'roc-return-on-investment',
  templateUrl: './return-on-investment.component.html',
  styleUrls: ['./return-on-investment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReturnOnInvestmentComponent implements OnInit
{

  @Input() roiAggregateDto: RoiAggregateDto;

  constructor() { }

  ngOnInit(): void
  {
  }

}
