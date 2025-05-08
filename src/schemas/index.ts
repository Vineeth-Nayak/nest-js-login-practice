import { User, UserSchema } from './user.schema';

export const models = [{ name: User.name, schema: UserSchema }];

export * from './user.schema';
