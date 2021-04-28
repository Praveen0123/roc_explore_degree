import { Injectable } from '@angular/core';
import { Result } from '@vantage-point/ddd-core';
import { BehaviorSubject } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { RoiAggregate } from '../domain';
import { CareerGoalDto, CurrentInformationDto, EducationCostDto, EducationFinancingDto, RoiAggregateDto } from '../dtos';
import { CreateRoiModelError, InvalidRoiModelError, RoiModelMissingError } from '../errors';
import { RoiModelAggregateMapper } from '../mappers/roi-model-aggregate.mapper';
import { RoiCalculatorOutputModel } from '../models';
import { LifetimeEarningsService } from './lifetime-earnings.service';


@Injectable()
export class RoiModelService
{
  private roiAggregateSubject = new BehaviorSubject<RoiAggregate>(undefined);
  private roiModelAggregateMapper: RoiModelAggregateMapper = RoiModelAggregateMapper.create();


  constructor
    (
      private lifetimeEarningsService: LifetimeEarningsService
    )
  {
  }


  async createEmptyRoiAggregateAsync(roiAggregateDto?: RoiAggregateDto): Promise<RoiAggregateDto>
  {
    roiAggregateDto = roiAggregateDto ?? this.createEmptyRoiAggregateDto();

    const roiAggregate: RoiAggregate = this.createRoiAggregate(roiAggregateDto);

    return await this.processAggregateAsync(roiAggregate);
  }

  async updateCurrentInformationAsync(currentInformationDto: CurrentInformationDto): Promise<RoiAggregateDto>
  {
    this.checkIfRoiAggregateExists();

    try
    {

      const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

      roiAggregate.updateCurrentInformation(currentInformationDto);

      return await this.processAggregateAsync(roiAggregate);
    }
    catch (error)
    {
      throw InvalidRoiModelError.create('Current information is invalid', error);
    }
  }

  async updateCareerGoalAsync(careerGoalDto: CareerGoalDto): Promise<RoiAggregateDto>
  {
    this.checkIfRoiAggregateExists();

    try
    {
      const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

      roiAggregate.updateCareerGoal(careerGoalDto);

      return await this.processAggregateAsync(roiAggregate);
    }
    catch (error)
    {
      throw InvalidRoiModelError.create('Career Goal is invalid', error);
    }
  }

  async updateEducationCostAsync(educationCostDto: EducationCostDto): Promise<RoiAggregateDto>
  {
    this.checkIfRoiAggregateExists();

    try
    {
      const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

      roiAggregate.updateEducationCost(educationCostDto);

      return await this.processAggregateAsync(roiAggregate);
    }
    catch (error)
    {
      throw InvalidRoiModelError.create('Education Cost is invalid', error);
    }
  }

  async updateEducationFinancingAsync(educationFinancingDto: EducationFinancingDto): Promise<RoiAggregateDto>
  {
    this.checkIfRoiAggregateExists();

    try
    {
      const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

      roiAggregate.updateEducationFinancing(educationFinancingDto);

      return await this.processAggregateAsync(roiAggregate);
    }
    catch (error)
    {
      throw InvalidRoiModelError.create('Education Financing is invalid', error);
    }
  }

  async resetRoiModelAsync(): Promise<RoiAggregateDto>
  {
    this.checkIfRoiAggregateExists();

    const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

    const roiAggregateDto: RoiAggregateDto = this.createEmptyRoiAggregateDto();
    roiAggregateDto.id = roiAggregate.roiModelAggregateId.id.toString();
    roiAggregateDto.name = roiAggregate.name;

    const resetRoiAggregate: RoiAggregate = this.createRoiAggregate(roiAggregateDto);

    this.lifetimeEarningsService.clear();

    return await this.processAggregateAsync(resetRoiAggregate);
  }



  private async processAggregateAsync(roiAggregate: RoiAggregate): Promise<RoiAggregateDto>
  {
    // console.log('CALCULATOR | 0.0');

    this.runCalculator(roiAggregate);

    // console.log('CALCULATOR - CONTINUE | 1.0');

    this.roiAggregateSubject.next(roiAggregate);

    return this.toRoiAggregateDto(roiAggregate);
  }



  private createRoiAggregate(roiAggregateDto: RoiAggregateDto): RoiAggregate
  {
    try
    {
      const roiModelAggregateOrError: Result<RoiAggregate> = this.roiModelAggregateMapper.toDomain(roiAggregateDto);

      if (roiModelAggregateOrError.isSuccess)
      {
        return roiModelAggregateOrError.getValue();
      }
      else
      {
        throw roiModelAggregateOrError.getError();
      }
    }
    catch (error)
    {
      throw CreateRoiModelError.create(error);
    }
  }

  private toRoiAggregateDto(roiAggregate: RoiAggregate): RoiAggregateDto
  {
    try
    {
      return this.roiModelAggregateMapper.toDTO(roiAggregate);;
    }
    catch (error)
    {
      throw CreateRoiModelError.create(error);
    }
  }

  private createEmptyRoiAggregateDto(): RoiAggregateDto
  {
    const emptyRoiAggregateDto: RoiAggregateDto =
    {
      name: null,
      currentInformation: null,

      roiModelId: null,
      careerGoal: null,
      educationCost: null,
      educationCostRefinement: null,
      educationFinancing: null,
      roiCalculatorInput: null,
      roiCalculatorInputHash: null,
      roiCalculatorOutput: null,
      radiusInMiles: null,
      dateCreated: null,
      lastUpdated: null,

      isCurrentInformationValid: false,
      isCareerGoalValid: false,
      isEducationCostValid: false,
      annualCostOfAttendance: 0,
      cumulativeCostOfAttendance: 0,
      outOfPocketExpensesByYear: [0]
    };

    return emptyRoiAggregateDto;
  }

  private checkIfRoiAggregateExists()
  {
    const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

    if (roiAggregate === null || roiAggregate === undefined)
    {
      throw RoiModelMissingError.create();
    }
  }

  private runCalculator(roiAggregate: RoiAggregate): Promise<boolean>
  {
    return new Promise(async (resolve, reject) =>
    {
      try
      {
        if (roiAggregate)
        {
          // console.log('CALCULATOR | 0.1');

          // CALCULATE ROI INPUT
          roiAggregate.calculateRoiCalculatorInput()
            .then((shouldCalculatorRun: boolean) =>
            {
              // console.log('CALCULATOR | 0.2');

              if (shouldCalculatorRun)
              {
                // RUN CALCULATOR
                this.lifetimeEarningsService.calculate(roiAggregate.roiCalculatorInput)
                  .pipe
                  (
                    take(1),
                    map((roiCalculatorOutput: RoiCalculatorOutputModel) =>
                    {

                      // console.log('CALCULATOR ** RESULTS ** | 0.3');

                      roiAggregate.updateRoiCalculatorOutput(roiCalculatorOutput);

                      resolve(true);
                    }),
                    catchError((error: any) =>
                    {
                      throw new Error(error);
                    })
                  )
                  .subscribe();
              }
              else
              {
                // console.log('CALCULATOR - NOPE | 0.3');
                // console.log('XXXXX DO NOT RUN CALCULATOR');
                resolve(false);
              }
            });
        }
        else
        {
          // console.log('XXXXX NO AGGREGATE');
          resolve(false);
        }

      }
      catch (error)
      {
        reject(error);
      }
    });
  }

}
