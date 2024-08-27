/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/dto.login';
import { SignUpDto } from './dto/dto.signUp';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth') // Tagging the controller for Swagger
@Controller('auth')
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
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'User signup' }) // Operation summary
  @ApiResponse({
    status: 201,
    description: 'User successfully signed up and token returned.',
  })
  @ApiBody({ type: SignUpDto })
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in and token returned.',
  })
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}
