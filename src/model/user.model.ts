import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'This is mode for user schema' })
export class UserModel {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  userID: string;

  @Field()
  displayName: string;
}
