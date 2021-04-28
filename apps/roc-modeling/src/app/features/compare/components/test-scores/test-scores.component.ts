import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RoiAggregateDto } from '@app/domain';

@Component({
  selector: 'roc-test-scores',
  templateUrl: './test-scores.component.html',
  styleUrls: ['./test-scores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestScoresComponent implements OnInit
{
  @Input() roiAggregateDto: RoiAggregateDto;

  constructor() { }

  ngOnInit(): void
  {
  }

}
