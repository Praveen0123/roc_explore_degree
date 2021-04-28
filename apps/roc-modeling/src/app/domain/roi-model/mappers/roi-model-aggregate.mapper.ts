import { IMapper, Result, UniqueEntityID } from '@vantage-point/ddd-core';

import { CurrentInformation, RoiModel } from '../domain';
import { RoiAggregate } from '../domain/roi-model.aggregate';
import { CurrentInformationDto, RoiAggregateDto, RoiModelDto } from '../dtos';
import { CurrentInformationMapper } from './current-information.mapper';
import { RoiModelMapper } from './roi-model.mapper';


export class RoiModelAggregateMapper implements IMapper<RoiAggregate, RoiAggregateDto>
{

  private constructor()
  {
  }

  public static create(): RoiModelAggregateMapper
  {
    return new RoiModelAggregateMapper();
  }


  toDTO(input: RoiAggregate): RoiAggregateDto
  {
    const currentInformation: CurrentInformationDto = (input.currentInformation) ? CurrentInformationMapper.create().toDTO(input.currentInformation) : null;
    const roiModelDto: RoiModelDto = (input.activeRoiModel) ? RoiModelMapper.create().toDTO(input.activeRoiModel) : null;

    const roiAggregateDto: RoiAggregateDto =
    {
      id: input.roiModelAggregateId.id.toString(),
      name: input.name,
      currentInformation: currentInformation,

      roiModelId: roiModelDto.id,
      careerGoal: roiModelDto.careerGoal,
      educationCost: roiModelDto.educationCost,
      educationCostRefinement: roiModelDto.educationCostRefinement,
      educationFinancing: roiModelDto.educationFinancing,
      roiCalculatorInput: roiModelDto.roiCalculatorInput,
      roiCalculatorInputHash: input.activeRoiModel.hash,
      roiCalculatorOutput: input.activeRoiModel.roiCalculatorOutput,
      radiusInMiles: roiModelDto.radiusInMiles,
      dateCreated: roiModelDto.dateCreated,
      lastUpdated: roiModelDto.lastUpdated,

      isCurrentInformationValid: input.isCurrentInformationValid(),
      isCareerGoalValid: input.isCareerGoalValid(),
      isEducationCostValid: input.isEducationCostValid(),
      annualCostOfAttendance: input.annualCostOfAttendance(),
      cumulativeCostOfAttendance: input.cumulativeCostOfAttendance(),
      outOfPocketExpensesByYear: input.outOfPocketExpensesByYear()
    };

    return roiAggregateDto;
  }


  toDomain(input: RoiAggregateDto): Result<RoiAggregate>
  {
    const roiModelDto: RoiModelDto = this.toRoiModel(input);
    const currentInformationOrError: Result<CurrentInformation> = CurrentInformationMapper.create().toDomain(input.currentInformation);
    const roiModelOrError: Result<RoiModel> = RoiModelMapper.create().toDomain(roiModelDto);

    if (currentInformationOrError.isSuccess && roiModelOrError.isSuccess)
    {
      const currentInformation: CurrentInformation = currentInformationOrError.getValue();
      const roiModel: RoiModel = roiModelOrError.getValue();

      return RoiAggregate.create
        (
          {
            currentInformation: currentInformation,
            roiModel: roiModel
          },
          UniqueEntityID.create(input.id)
        );
    }

    if (currentInformationOrError.isFailure)
    {
      throw currentInformationOrError.getError();
    }

    if (roiModelOrError.isFailure)
    {
      throw roiModelOrError.getError();
    }
  }


  toRoiModel(input: RoiAggregateDto): RoiModelDto
  {
    const roiModelDto: RoiModelDto =
    {
      id: input.roiModelId,
      name: input.name,
      careerGoal: input.careerGoal,
      educationCost: input.educationCost,
      educationCostRefinement: input.educationCostRefinement,
      educationFinancing: input.educationFinancing,
      roiCalculatorInput: input.roiCalculatorInput,
      radiusInMiles: input.radiusInMiles,
      dateCreated: input.dateCreated,
      lastUpdated: input.lastUpdated
    };

    return roiModelDto;
  }

}
