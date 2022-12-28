import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, fullname, password } = createUserDto;
    const existUser = await this.findByUsername(username);

    if (existUser) throw new ConflictException();

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const createduser = new this.userModel({
      username,
      fullname,
      password: hash,
    });
    return createduser.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: string, user: any, updateUserDto: UpdateUserDto) {
    if (id !== user.userId) throw new UnauthorizedException();

    return this.userModel.updateOne(
      { _id: id },
      { $set: { ...updateUserDto } },
    );
  }

  remove(id: string, user: any) {
    if (id !== user.userId) throw new UnauthorizedException();
    return this.userModel.deleteOne({ _id: id });
  }
}
