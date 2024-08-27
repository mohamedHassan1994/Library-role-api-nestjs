/* eslint-disable prettier/prettier */
import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schemas/book.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiPropertyOptional({
    description: 'Title of the book',
    example: 'The Great Gatsby',
  })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiPropertyOptional({
    description: 'Description of the book',
    example: 'A novel written by American author F. Scott Fitzgerald.',
  })
  @IsOptional()
  @IsString()
  readonly description: string;

  @ApiPropertyOptional({
    description: 'Author of the book',
    example: 'F. Scott Fitzgerald',
  })
  @IsOptional()
  @IsString()
  readonly author: string;

  @ApiPropertyOptional({
    description: 'Price of the book',
    example: 15.99,
  })
  @IsOptional()
  @IsNumber()
  readonly price: number;

  @ApiPropertyOptional({
    description: 'Category of the book',
    enum: Category,
    example: Category,
  })
  @IsOptional()
  @IsEnum(Category, { message: 'Please enter correct category.' })
  readonly category: Category;

  @ApiProperty({
    description: 'User associated with the book',
    example: null,
    readOnly: true,
  })
  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
