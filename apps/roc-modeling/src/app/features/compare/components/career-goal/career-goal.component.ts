import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RoiAggregateDto } from '@app/domain';

@Component({
  selector: 'roc-career-goal',
  templateUrl: './career-goal.component.html',
  styleUrls: ['./career-goal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareerGoalComponent implements OnInit
{
  @Input() roiAggregateDto: RoiAggregateDto;

  constructor() { }

  ngOnInit(): void
  {
  }

}
