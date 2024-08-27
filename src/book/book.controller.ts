/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorators';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetListDto } from './dto/getList-book-dto';

@ApiTags('books') // Tagging the controller for Swagger
@Controller('books')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer',
  required: true,
  example:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2NjNmYwYWIyMTQ0ZDQxNzRhN2I2MyIsImlhdCI6MTcyNDY5NjMwNCwiZXhwIjoxNzI0OTU1NTA0fQ.M8pUNB6aeWbDm5vDGikhfd6cNF0KBtcyt0DQTnFI3FI',
})
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiNotFoundResponse({ description: 'Not found' })
@ApiTooManyRequestsResponse({
  description: 'Too many request',
})
export class BookController {
  constructor(private bookService: BookService) {}

  @Post('create')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: 'Create a new book' }) // Operation summary
  @ApiResponse({
    status: 201,
    description: 'The book has been successfully created.',
    type: Book,
  })
  @ApiBody({ type: CreateBookDto })
  async createBook(
    @Body()
    book: CreateBookDto,
    @Req() req,
  ): Promise<Book> {
    return this.bookService.create(book, req.user);
  }

  @Throttle({ default: { limit: 1, ttl: 2000 } })
  @Get('getBooks')
  @Roles(Role.User, Role.Moderator, Role.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of books.',
    type: [Book],
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Query parameters for filtering books',
  })
  async getAllBooks(@Query() query: GetListDto): Promise<Book[]> {
    return this.bookService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.User, Role.Moderator, Role.Admin)
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a book by ID.',
    type: Book,
  })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the book' })
  async getBook(
    @Param('id')
    id: string,
  ): Promise<Book> {
    return this.bookService.findById(id);
  }

  @Put(':id')
  @Roles(Role.Moderator, Role.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: 'Update a book by ID' })
  @ApiResponse({
    status: 200,
    description: 'The book has been successfully updated.',
    type: Book,
  })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the book' })
  @ApiBody({ type: UpdateBookDto })
  async updateBook(
    @Param('id')
    id: string,
    @Body()
    book: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateById(id, book);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.Moderator, Role.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiResponse({
    status: 204,
    description: 'The book has been successfully deleted.',
  })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the book' })
  async deleteBook(
    @Param('id')
    id: string,
  ): Promise<{ deleted: boolean }> {
    return this.bookService.deleteById(id);
  }

  @Put('upload/:id')
  @Roles(Role.Moderator, Role.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @Throttle({ default: { ttl: 2000, limit: 1 } })
  @UseGuards(AuthGuard())
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Upload images for a book' })
  @ApiResponse({ status: 200, description: 'Images uploaded successfully.' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the book' })
  @ApiBody({ description: 'Array of image files to upload' })
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.bookService.uploadImages(id, files);
  }
}
