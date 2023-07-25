import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty()
  @IsString()
  @Length(10, 100)
  title: string;

  @ApiProperty()
  @IsString()
  content: string;
}
