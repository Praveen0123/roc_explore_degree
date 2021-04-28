import { Entity, UniqueEntityID } from '@vantage-point/ddd-core';

export class RoiModelAggregateId extends Entity<any>
{
  get id(): UniqueEntityID
  {
    return this._id;
  }

  private constructor(id?: UniqueEntityID)
  {
    super(null, id);
  }

  public static create(id?: UniqueEntityID | string): RoiModelAggregateId
  {
    if (id instanceof UniqueEntityID)
    {
      return new RoiModelAggregateId(id);
    }

    return new RoiModelAggregateId(UniqueEntityID.create(id));
  }
}
