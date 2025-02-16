import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, PaginateModel, PaginateResult } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: PaginateModel<User>) {}

  getAll() {
    return this.userModel.find();
  }

  getById(_id: string) {
    return this.userModel.findById(_id);
  }

  getByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  create(body: CreateUserDto) {
    return this.userModel.create(body);
  }

  async update(_id: string, body: UpdateUserDto) {
    const user = await this.getById(_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, body);
    await user.save();
    return user;
  }

  async delete(_id: string) {
    const user = await this.getById(_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.deleteOne();
    return user;
  }

  count(filter: FilterQuery<User> = {}) {
    return this.userModel.countDocuments(filter);
  }

  async paginate(
    page: number = 1,
    limit: number = 10,
    filter: FilterQuery<User> = {},
    sort: string,
  ): Promise<PaginateResult<User>> {
    return this.userModel.paginate(filter, {
      page,
      limit,
      sort,
    });
  }
}
