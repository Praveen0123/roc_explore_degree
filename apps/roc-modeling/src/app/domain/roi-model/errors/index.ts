import { UseCaseError } from '@vantage-point/ddd-core';


export class CreateRoiModelError extends UseCaseError
{
  private constructor(error: Error)
  {
    super(`Error happened while creating a new ROI Model:`, error);
  }

  public static create(error: Error): CreateRoiModelError
  {
    return new CreateRoiModelError(error);
  }
}


export class RoiModelMissingError extends UseCaseError
{
  private constructor(error?: Error)
  {
    super(`ROI Model does not exist:`, error);
  }

  public static create(error?: Error): RoiModelMissingError
  {
    return new RoiModelMissingError(error);
  }
}


export class InvalidRoiModelError extends UseCaseError
{
  private constructor(message: string, error: Error)
  {
    super(message, error);
  }

  public static create(message: string, error: Error): InvalidRoiModelError
  {
    return new InvalidRoiModelError(message, error);
  }
}
