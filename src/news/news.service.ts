import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { NewsNotFoundException } from './exceptions/news-not-found.exception';
import { DontAccessNewsException } from './exceptions/dont-access-news.exception';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private newsRepository: Repository<News>,
  ) {}
  async create(userId: number, createNewsDto: CreateNewsDto) {
    const news = await this.newsRepository.save({
      content: createNewsDto.content,
      title: createNewsDto.title,
      userId,
    });
    return {
      id: news.id,
    };
  }

  findAll(options: { limit: number; offset: number }) {
    return this.newsRepository.find({
      skip: options.offset,
      take: options.limit,
    });
  }

  async findOne(id: number) {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) throw new NewsNotFoundException();
    return news;
  }

  async update(userId: number, id: number, updateNewsDto: UpdateNewsDto) {
    const news = await this.findOne(id);
    if (news.userId !== userId) throw new DontAccessNewsException();
    try {
      const update: Partial<News> = {};

      if (updateNewsDto.title) {
        update.title = updateNewsDto.title;
      }

      if (updateNewsDto.content) {
        update.content = updateNewsDto.content;
      }

      await this.newsRepository.update({ id }, update);
      return {
        result: true,
      };
    } catch (error) {
      throw new HttpException(
        'Error save news',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(userId: number, id: number) {
    const news = await this.findOne(id);
    if (news.userId !== userId) throw new DontAccessNewsException();;
    try {
      await this.newsRepository.delete(id);
      return {
        result: true,
      };
    } catch (error) {
      throw new HttpException('Error delete news', 400);
    }
  }
}
