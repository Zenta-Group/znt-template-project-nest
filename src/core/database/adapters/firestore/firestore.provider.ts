import { Provider } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';

import { ConfigService } from '@nestjs/config';

export function createFirestoreProvider(
  providerToken: string | symbol,
  projectIdKey: string,
  databaseIdKey?: string,
): Provider {
  return {
    provide: providerToken,
    useFactory: (configService: ConfigService) => {
      const projectId = configService.get<string>(projectIdKey);
      const databaseId = databaseIdKey
        ? configService.get<string>(databaseIdKey)
        : undefined;
      if (!projectId) {
        throw new Error('GCP_PROJECT_ID is required for Firestore connection');
      }
      const firestoreConfig: any = {
        projectId,
        preferRest: false,
        databaseId,
      };
      try {
        return new Firestore(firestoreConfig);
      } catch (error) {
        console.error('Error initializing Firestore:', error);
        throw error;
      }
    },
    inject: [ConfigService],
  };
}
