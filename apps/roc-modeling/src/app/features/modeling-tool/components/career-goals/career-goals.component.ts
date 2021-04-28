import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CareerGoalForm } from '@app/core/models';
import { RoiAggregateDto } from '@app/domain';


@Component({
  selector: 'roc-career-goals',
  templateUrl: './career-goals.component.html',
  styleUrls: ['./career-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareerGoalsComponent implements OnInit
{
  @Input() roiModel: RoiAggregateDto;
  @Output('onCareerGoalSubmitted') careerGoalEventEmitter = new EventEmitter<CareerGoalForm>();

  selectedTabIndex: number;

  constructor() { }

  ngOnInit(): void
  {
    this.selectedTabIndex = this.roiModel.careerGoal.careerGoalPathType;
  }

  onExploreCareersSubmitted(careerGoalForm: CareerGoalForm)
  {
    this.emitCareerGoal(careerGoalForm);
  }

  onExploreDegreesSubmitted(careerGoalForm: CareerGoalForm)
  {
    this.emitCareerGoal(careerGoalForm);
  }

  private emitCareerGoal(careerGoalForm: CareerGoalForm)
  {
    if (this.careerGoalEventEmitter.observers.length > 0)
    {
      this.careerGoalEventEmitter.emit(careerGoalForm);
    }
  }
}
