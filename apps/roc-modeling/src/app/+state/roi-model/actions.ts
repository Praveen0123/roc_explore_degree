import { CareerGoalForm, CurrentInformationForm, EducationCostForm } from '@app/core/models';
import { EducationFinancingDto, RoiAggregateDto } from '@app/domain';
import { createAction, props } from '@ngrx/store';


export const loadSelectedRoiModelOrCreateANewOne = createAction
  (
    '[RoiModel] load selected roi model, or create a new one'
  );

export const addRoiModel = createAction
  (
    '[RoiModel] add roiModel',
    props<{ roiAggregateDto: RoiAggregateDto; }>()
  );


export const updateRoiModelFromCurrentInformation = createAction
  (
    '[RoiModel] update roi model from current information',
    props<{ roiAggregateDto: RoiAggregateDto; }>()
  );
export const updateRoiModelFromCareerGoal = createAction
  (
    '[RoiModel] update roi model from career goal',
    props<{ roiAggregateDto: RoiAggregateDto; }>()
  );
export const updateRoiModelFromEducationCost = createAction
  (
    '[RoiModel] update roi model from education cost',
    props<{ roiAggregateDto: RoiAggregateDto; }>()
  );
export const updateRoiModelFromEducationFinancing = createAction
  (
    '[RoiModel] update roi model from education financing',
    props<{ roiAggregateDto: RoiAggregateDto; }>()
  );


export const deleteRoiModel = createAction
  (
    '[RoiModel] remove roi model',
    props<{ roiAggregateDto: RoiAggregateDto; }>()
  );

export const removeSelectedRoiModel = createAction
  (
    '[RoiModel] remove selectetd roi model'
  );

export const NoopAction = createAction
  (
    '[RoiModel] NoopAction'
  );


export const processCurrentInformationForm = createAction
  (
    '[RoiModel] process currentt information form',
    props<{ currentInformationForm: CurrentInformationForm; }>()
  );
export const processCareerGoalForm = createAction
  (
    '[RoiModel] process career goal form',
    props<{ careerGoalForm: CareerGoalForm; }>()
  );
export const processEducationCostForm = createAction
  (
    '[RoiModel] process education cost form',
    props<{ educationCostForm: EducationCostForm; }>()
  );
export const processEducationFinancingForm = createAction
  (
    '[RoiModel] process education financing form',
    props<{ educationFinancingForm: EducationFinancingDto; }>()
  );


export const requestResetRoiModel = createAction
  (
    '[RoiModel] request reset roi model'
  );
export const resetRoiModelReceived = createAction
  (
    '[RoiModel] reset roi model received',
    props<{ roiAggregateDto: RoiAggregateDto; }>()
  );
