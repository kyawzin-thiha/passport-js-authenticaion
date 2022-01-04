import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class UserArgs {
  @Field()
  displayName: string;

  @Field()
  userName: string;

  @Field()
  password: string;
}
