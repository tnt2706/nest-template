import {
  EntityManager,
  Transaction,
  TransactionManager
} from 'typeorm';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  Req,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import {
  AuthActiveRequestDTO,
  AuthCreatePasswordResetRequestDTO,
  AuthGetPasswordResetRequestDTO,
  AuthLoginRequestDTO,
  AuthLoginResponseDTO,
  AuthLogoutRequestDTO,
  AuthRefreshTokenRequestDTO,
  AuthRefreshTokenResponseDTO,
  AuthRegisterRequestDTO,
  AuthUpdatePasswordResetRequestDTO,
} from '@api/dtos';
import {
  AuthService
} from '@api/services';
import {
  IAuthRequest,
} from '@api/interfaces';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
  ) { }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('register')
  @ApiResponse({
    description: 'Register with basic information',
    status: 201,
  })
  @HttpCode(201)
  /**
   * @param  {} @Req(
   * @param  {IBaseRequest} req
   * @param  {} @Body(
   * @param  {AuthRegisterRequestDTO} payload
   */
  @Transaction()
  register(
    @Body() payload: AuthRegisterRequestDTO,
    @TransactionManager() manager: EntityManager,
  ) {
    return this.authService.register(payload, manager);
  }

  @Get('active')
  @ApiResponse({
    description: 'Active account by token send through your email',
    status: 200,
    type: AuthLoginResponseDTO
  })
  @HttpCode(200)
  async active(@Query() payload: AuthActiveRequestDTO) {
    return this.authService.active(payload);
  }

  @ApiResponse({
    description: 'User input email and password then login and get accessToken and refreshToken',
    status: 200,
    type: AuthLoginResponseDTO,
  })
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('login')
  /**
   * User input email and password then login and get accessToken and refreshToken
   * @param  {} @Body()
   * @param  {AuthLoginRequestDTO} payload
   */
  async login(@Body() payload: AuthLoginRequestDTO) {
    return this.authService.login(payload);
  }

  @ApiResponse({
    description: 'User re-create accessToken using refreshToken',
    status: 200,
    type: AuthRefreshTokenResponseDTO,
  })
  @HttpCode(200)
  @Post('token')
  async refreshToken(
    @Req() req: IAuthRequest,
    @Body() payload: AuthRefreshTokenRequestDTO,
  ) {
    return this.authService.refreshToken(payload);
  }

  @ApiResponse({
    description: 'Create new reset password request',
    status: 201,
    type: Boolean,
  })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('password/reset')
  /**
   * User input their email and request change password for that email
   * @param  {} @Body(
   * @param  {AuthCreatePasswordResetRequestDTO} payload
   */
  async createPasswordReset(@Body() payload: AuthCreatePasswordResetRequestDTO) {
    return this.authService.createPasswordReset(payload);
  }

  @ApiResponse({
    description: 'Check token with reset password information is valid or not',
    status: 200,
    type: Boolean,
  })
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('password/reset')
  /**
   * Check token with information is valid or not
   * @param  {} @Body(
   * @param  {AuthGetPasswordResetRequestDTO} payload
   */
  async getPasswordReset(@Query() payload: AuthGetPasswordResetRequestDTO) {
    return this.authService.getPasswordReset(payload);
  }

  @ApiResponse({
    description: 'User update their password with valid accessToken',
    status: 200,
    type: Boolean,
  })
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch('password/reset')
  /**
   * User update their password with valid accessToken
   * @param  {} @Body(
   * @param  {AuthUpdatePasswordResetRequestDTO} payload
   */
  async updatePasswordReset(@Req() req: IAuthRequest, @Body() payload: AuthUpdatePasswordResetRequestDTO) {
    return this.authService.updatePasswordReset(req, payload);
  }

  @ApiResponse({
    description: 'Logout endpoint to terminate the accessToken and do some actions on user sign out',
    status: 204,
  })
  @HttpCode(204)
  @Post('logout')
  /**
   * @param  {} @Req(
   * @param  {IAuthRequest} req
   * @param  {} @Body(
   * @param  {AuthLoginRequestDTO} payload
   */
  async logout(@Req() req: IAuthRequest, @Body() payload: AuthLogoutRequestDTO) {
    return this.authService.logout(req, payload);
  }
}
