// firestore-database.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Firestore } from '@google-cloud/firestore';
import { IDatabaseService } from '../../shared/interfaces/i-database-service.interface';
import {
  MissingCollectionException,
  DocumentConflictException,
  DocumentNotFoundException,
  DatabaseAccessDeniedException,
  QueryFailedException,
  GenericDatabaseException,
} from '../../shared/exceptions/database-exceptions';
import { IDatabaseOptions } from '../../shared/interfaces/i-database-options.interface';
import { Constants } from 'src/shared/constants/constants';

@Injectable()
export class FirestoreRepository<T extends { id?: string }>
  implements IDatabaseService<T>
{
  private logger = new Logger('FirestoreDatabaseService');
  private firestore: Firestore;
  private collectionName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly options: IDatabaseOptions,
  ) {
    const projectId = this.configService.get<string>('gcpProjectId');
    const databaseId = this.configService.get<string>('gcpFirestoreDatabaseId');
    this.collectionName = this.options.collectionName;
    if (!this.collectionName) {
      throw new MissingCollectionException();
    }

    try {
      this.firestore = new Firestore({
        projectId: projectId,
        databaseId: databaseId,
      });
    } catch (error) {
      this.handleDbError(error);
    }
  }

  public async create(id: string, data: T): Promise<T> {
    try {
      const docRef = this.firestore.collection(this.collectionName).doc(id);
      const existingDoc = await docRef.get();
      if (existingDoc.exists) {
        throw new DocumentConflictException(id);
      }

      await docRef.set(data);
      return this.getByIdOrThrow(id);
    } catch (error) {
      this.handleDbError(error, id);
    }
  }

  public async createOrReplace(id: string, data: T): Promise<T> {
    try {
      const docRef = this.firestore.collection(this.collectionName).doc(id);
      await docRef.set(data);
      return this.getByIdOrThrow(id);
    } catch (error) {
      this.handleDbError(error, id);
    }
  }

  public async getById(id: string): Promise<T | null> {
    try {
      const docRef = this.firestore.collection(this.collectionName).doc(id);
      const doc = await docRef.get();
      if (!doc.exists) {
        return null;
      }
      const data = doc.data() as T;
      data.id = doc.id;
      return data;
    } catch (error) {
      this.handleDbError(error, id);
    }
  }

  private async getByIdOrThrow(id: string): Promise<T> {
    const doc = await this.getById(id);
    if (!doc) {
      throw new DocumentNotFoundException(id);
    }
    return doc;
  }

  public async getByField(field: string, value: string): Promise<T | null> {
    try {
      const query = this.firestore
        .collection(this.collectionName)
        .where(field, '==', value);
      const snapshot = await query.get();

      if (snapshot.empty) {
        return null;
      }
      const doc = snapshot.docs[0];
      const data = doc.data() as T;
      data.id = doc.id;
      return data;
    } catch (error) {
      this.handleDbError(error, `Field: ${field} = ${value}`);
    }
  }

  public async getAll(): Promise<T[]> {
    try {
      const query = this.firestore.collection(this.collectionName);
      const snapshot = await query.get();
      const documents: T[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as T;
        data.id = doc.id;
        documents.push(data);
      });
      return documents;
    } catch (error) {
      this.handleDbError(error);
    }
  }

  public async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const docRef = this.firestore.collection(this.collectionName).doc(id);
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new DocumentNotFoundException(id);
      }
      await docRef.update(data);
      return this.getByIdOrThrow(id);
    } catch (error) {
      this.handleDbError(error, id);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const docRef = this.firestore.collection(this.collectionName).doc(id);
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new DocumentNotFoundException(id);
      }
      await docRef.delete();
    } catch (error) {
      this.handleDbError(error, id);
    }
  }

  private handleDbError(error: any, context?: string): never {
    this.logger.error(
      `Firestore error (${context || ''}): ${error.message}`,
      error.stack,
    );

    if (error.code === 7) {
      throw new DatabaseAccessDeniedException(error.message);
    } else if (error.code === 5) {
      throw new DocumentNotFoundException(
        context || Constants.ERROR_MESSAGE.UNKNOWN,
      );
    } else if (error.code === 6) {
      throw new DocumentConflictException(
        context || Constants.ERROR_MESSAGE.UNKNOWN,
      );
    } else if (error.code === 3) {
      throw new QueryFailedException(Constants.ERROR_MESSAGE.QUERY_FAILED);
    }
    throw new GenericDatabaseException(Constants.ERROR_MESSAGE.GENERIC_ERROR);
  }
}
