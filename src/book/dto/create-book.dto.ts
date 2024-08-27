/* eslint-disable prettier/prettier */
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../schemas/book.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: 'Title of the book',
    example: 'The Great Gatsby',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Description of the book',
    example: 'A novel written by American author F. Scott Fitzgerald.',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Author of the book',
    example: 'F. Scott Fitzgerald',
  })
  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @ApiProperty({
    description: 'Price of the book',
    example: 15.99,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    description: 'Category of the book',
    enum: Category,
    example: Category,
  })
  @IsNotEmpty()
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
