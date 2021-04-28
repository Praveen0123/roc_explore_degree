import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { AccordionPanelEnum, AccordionState } from '@app/+state/accordion/state';
import { CareerGoalForm, CurrentInformationForm, EducationCostForm } from '@app/core/models';
import { EducationFinancingDto, RoiAggregateDto } from '@app/domain';
import { UserProfileModel } from '@state/user-profile/models';

@Component({
  selector: 'roc-modeling-tool-controls',
  templateUrl: './modeling-tool-controls.component.html',
  styleUrls: ['./modeling-tool-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelingToolControlsComponent implements OnInit, OnChanges
{
  @Input() userProfileModel: UserProfileModel;
  @Input() roiModel: RoiAggregateDto;
  @Input() accordionState: AccordionState;
  @Output('onCurrentInformationSubmitted') currentInformationEventEmitter = new EventEmitter<CurrentInformationForm>();
  @Output('markCurrentInformationAsInitialized') initializeCurrentInformationEventEmitter = new EventEmitter<void>();
  @Output('onCareerGoalSubmitted') careerGoalEventEmitter = new EventEmitter<CareerGoalForm>();
  @Output('onEducationCostSubmitted') educationCostEventEmitter = new EventEmitter<EducationCostForm>();
  @Output('onEducationFinancingSubmitted') educationFinancingEventEmitter = new EventEmitter<EducationFinancingDto>();
  @Output('onReset') resetEventEmitter = new EventEmitter<void>();
  @Output('onPanelChange') updateActivePanelEventEmitter = new EventEmitter<AccordionPanelEnum>();


  AccordionPanelEnum = AccordionPanelEnum;
  accordionPanelEnum: AccordionPanelEnum;
  isCurrentInformationValid: boolean = false;
  isCareerGoalValid: boolean = false;
  isEducationCostValid: boolean = false;
  isAccordionMultiPanel: boolean = false;
  step: number = 0;

  @ViewChild('accordion', { static: true }) accordion: MatAccordion;

  constructor() { }

  ngOnInit(): void
  {
    this.checkValidity();
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.accordionState && !changes.accordionState.firstChange)
    {
      this.checkValidity();
    }
  }

  setStep(accordionPanelEnum: AccordionPanelEnum)
  {
    this.step = accordionPanelEnum;

    if (this.updateActivePanelEventEmitter.observers.length > 0)
    {
      this.updateActivePanelEventEmitter.emit(accordionPanelEnum);
    }
  }

  onCurrentInformationSubmitted(currentInformationForm: CurrentInformationForm)
  {
    if (this.currentInformationEventEmitter.observers.length > 0)
    {
      this.currentInformationEventEmitter.emit(currentInformationForm);
    }
  }

  onCareerGoalSubmitted(careerGoalForm: CareerGoalForm)
  {
    if (this.careerGoalEventEmitter.observers.length > 0)
    {
      this.careerGoalEventEmitter.emit(careerGoalForm);
    }
  }

  onEducationCostSubmitted(educationCostForm: EducationCostForm)
  {
    if (this.educationCostEventEmitter.observers.length > 0)
    {
      this.educationCostEventEmitter.emit(educationCostForm);
    }
  }

  onEducationFinancingSubmitted(educationFinancing: EducationFinancingDto)
  {
    if (this.educationFinancingEventEmitter.observers.length > 0)
    {
      this.educationFinancingEventEmitter.emit(educationFinancing);
    }
  }

  currentInformationCollapsed()
  {
    if (!this.userProfileModel.hasCurrentInformationBeenInitialized && this.initializeCurrentInformationEventEmitter.observers.length > 0)
    {
      this.initializeCurrentInformationEventEmitter.emit();
    }
  }

  onClickStartOver()
  {
    if (this.resetEventEmitter.observers.length > 0)
    {
      this.resetEventEmitter.emit();
      this.setStep(0);
    }
  }

  onClickExpandAll()
  {
    this.isAccordionMultiPanel = true;

    setTimeout((() =>
    {
      this.accordion.openAll();
    }), 100);

  }

  onClickCollapseAll()
  {
    this.isAccordionMultiPanel = false;
    this.accordion.closeAll();
  }


  private checkValidity()
  {
    this.step = this.accordionState.activePanel;
    this.isCurrentInformationValid = this.accordionState.isCurrentInformationValid ?? false;
    this.isCareerGoalValid = this.accordionState.isCareerGoalValid ?? false;
    this.isEducationCostValid = this.accordionState.isEducationCostValid ?? false;
  }

}
