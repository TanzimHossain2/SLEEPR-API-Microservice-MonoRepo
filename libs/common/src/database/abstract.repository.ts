import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<T extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<T>) {}

  async create(document: Omit<T, '_id'>): Promise<T> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createDocument.save()).toJSON() as T;
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T> {
    const document = await this.model.findOne(filterQuery).lean(true);

    if (!document) {
      this.logger.warn(
        `Document not found with filter: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException('Document not found');
    }

    return document as T;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<T> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<T>(true);

    if (!document) {
      this.logger.warn(
        `Document not found with filter: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException('Document not found');
    }

    return document as T;
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filterQuery).lean<T[]>(true);
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T> {
    return await this.model.findOneAndDelete(filterQuery).lean<T>(true);
  }
}
