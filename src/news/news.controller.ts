import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthnGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserId } from 'src/auth/decorators/user-id.decorator';

@Controller('news')
@ApiTags('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthnGuard)
  @Post()
  create(@UserId() userId: number, @Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(userId, createNewsDto);
  }

  @Get()
  @ApiQuery({ type: Number, name: 'offset', example: 0 })
  @ApiQuery({ type: Number, name: 'limit', example: 0 })
  findAll(@Query('offset') offset: number, @Query('limit') limit: number) {
    return this.newsService.findAll({
      limit: +limit ?? 10,
      offset: +offset ?? 0,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthnGuard)
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: string) {
    return this.newsService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthnGuard)
  @Patch(':id')
  update(
    @UserId() userId: number,
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    return this.newsService.update(userId, +id, updateNewsDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthnGuard)
  @Delete(':id')
  remove(
    @UserId() userId: number,
    @Param('id', new ParseIntPipe()) id: string,
  ) {
    return this.newsService.remove(userId, +id);
  }
}
