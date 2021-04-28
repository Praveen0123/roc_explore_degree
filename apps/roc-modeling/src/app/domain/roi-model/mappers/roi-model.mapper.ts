import { IMapper, Result, UniqueEntityID } from '@vantage-point/ddd-core';

import { CareerGoal } from '../domain/career-goal.model';
import { EducationCost } from '../domain/education-costs.model';
import { EducationFinancing } from '../domain/education-financing.model';
import { RoiModel } from '../domain/roi-model';
import { CareerGoalDto, EducationCostDto, EducationFinancingDto, RoiModelDto } from '../dtos';
import { CareerGoalMapper } from './career-goal.mapper';
import { EducationCostMapper } from './education-cost.mapper';
import { EducationFinancingMapper } from './education-financing.mapper';


export class RoiModelMapper implements IMapper<RoiModel, RoiModelDto>
{

  private constructor()
  {
  }

  public static create(): RoiModelMapper
  {
    return new RoiModelMapper();
  }

  toDTO(input: RoiModel): RoiModelDto
  {
    const careerGoal: CareerGoalDto = (input.careerGoal) ? CareerGoalMapper.create().toDTO(input.careerGoal) : null;
    const educationCost: EducationCostDto = (input.educationCost) ? EducationCostMapper.create().toDTO(input.educationCost) : null;
    const educationFinancing: EducationFinancingDto = (input.educationFinancing) ? EducationFinancingMapper.create().toDTO(input.educationFinancing) : null;

    const roiModelDto: RoiModelDto =
    {
      id: input.roiModelId.id.toString(),
      name: input.name,
      careerGoal: careerGoal,
      educationCost: educationCost,
      educationCostRefinement: null,
      educationFinancing: educationFinancing,
      roiCalculatorInput: input.roiCalculatorInput,
      radiusInMiles: input.radiusInMiles,
      dateCreated: input.dateCreated,
      lastUpdated: input.lastUpdated
    };

    return roiModelDto;
  }


  toDomain(input: RoiModelDto): Result<RoiModel>
  {
    const careerGoalOrError: Result<CareerGoal> = CareerGoalMapper.create().toDomain(input.careerGoal);
    const educationCostOrError: Result<EducationCost> = EducationCostMapper.create().toDomain(input.educationCost);
    const educationFinancingtOrError: Result<EducationFinancing> = EducationFinancingMapper.create().toDomain(input.educationFinancing);

    const careerGoal: CareerGoal = (careerGoalOrError.isSuccess) ? careerGoalOrError.getValue() : null;
    const educationCost: EducationCost = (educationCostOrError.isSuccess) ? educationCostOrError.getValue() : null;
    const educationFinancing: EducationFinancing = (educationFinancingtOrError.isSuccess) ? educationFinancingtOrError.getValue() : null;

    return RoiModel.create
      (
        {
          name: input.name,
          careerGoal: careerGoal,
          educationCost: educationCost,
          educationCostRefinement: input.educationCostRefinement ?? null,
          educationFinancing: educationFinancing,
          radiusInMiles: input?.radiusInMiles ?? null,
          dateCreated: input.dateCreated ?? null,
          lastUpdated: input.lastUpdated ?? null
        },
        UniqueEntityID.create(input.id)
      );
  }

}
