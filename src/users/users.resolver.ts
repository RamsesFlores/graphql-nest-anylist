import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}


  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ ValidRoles.admin]) user: User
  ): Promise<User[]> {

    return this.usersService.findAll( validRoles.roles );

  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser([ ValidRoles.admin]) user: User
    ): Promise<User> {

    return this.usersService.findOneById( id );

  }

  @Mutation( () => User, { name: 'updateUser'} )
  async updateUser(
    @Args( 'updateUserInput' ) updateUserInput: UpdateUserInput,
    @CurrentUser([ ValidRoles.admin]) user: User
  ): Promise<User>{
    return this.usersService.update( updateUserInput.id, updateUserInput, user)
  }
  
  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser([ ValidRoles.admin]) user: User
    ): Promise<User> {
      
    return this.usersService.block( id, user );

  }

}
