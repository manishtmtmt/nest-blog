import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
  ) {}

  create(user: any, createPostDto: CreatePostDto) {
    const post = new this.postModel({
      ...createPostDto,
      authorId: user.userId,
    });
    return post.save();
  }

  findAll() {
    return this.postModel.find().exec();
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id);

    if (!post) throw new NotFoundException();
    return post;
  }

  async update(id: string, user: any, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.postModel.findById(id);

      if (!post) throw new NotFoundException();

      if (user.userId !== post.authorId) throw new UnauthorizedException();

      return this.postModel.updateOne(
        { _id: id },
        { $set: { ...updatePostDto } },
      );
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string, user: any) {
    const post = await this.postModel.findById(id);

    if (!post) throw new NotFoundException();

    if (user.userId !== post.authorId) throw new UnauthorizedException();
    return this.postModel.deleteOne({ _id: id });
  }
}
