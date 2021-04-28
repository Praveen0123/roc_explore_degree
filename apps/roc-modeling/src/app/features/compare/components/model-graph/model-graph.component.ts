import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RoiAggregateDto } from '@app/domain';

@Component({
  selector: 'roc-model-graph',
  templateUrl: './model-graph.component.html',
  styleUrls: ['./model-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelGraphComponent implements OnInit
{
  @Input() roiAggregateDto: RoiAggregateDto;

  constructor() { }

  ngOnInit(): void
  {
  }

}
