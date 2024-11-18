import {Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {UserAuthGuard} from "../guards/UserAuthGuard";
import {SentryInterceptor} from "../interceptors/sentry.interceptor";
import {AdminUserAuthGuard} from "../guards/AdminUserAuthGuard";
import {UserService} from "../services/user.service";
import {GetUserDetailsDto, User} from "../entities/User/User";
import {FormDataRequest} from "nestjs-form-data";
import {UserAuthGuardInterceptor} from "../interceptors/userAuthGuard.interceptor";

@Controller('user')
@UseInterceptors(SentryInterceptor)
export class UserController {

    constructor(private readonly userService: UserService) {

    }

    // Only for admins
    @UseGuards(AdminUserAuthGuard)
    @Post("adminGetAllUser")
    async adminGetAllUser(@Body() getAllUsersDto: any) {
        return await this.userService.adminGetAllUsers(getAllUsersDto);
    }

    @UseGuards(UserAuthGuard)
    @Get("IsUserAccountCreated")
    async IsUserAccountCreated(@Req() request: RequestWithUserIdInterface): Promise<any> {
        return await this.userService.isUserAccountCreated(request.userAuth0Id);
    }

    @UseGuards(UserAuthGuard)
    @Post("initialUserSetup")
    async initialUserSetup(@Req() request: RequestWithUserIdInterface, @Body() initialUserSetupRequestDto: any) {
        await this.userService.initialUserSetup(request.userAuth0Id, initialUserSetupRequestDto);
    }

    @UseGuards(UserAuthGuard)
    @Get("getMyUserDetails")
    async getMyUserDetails(@Req() request: RequestWithUserIdInterface): Promise<User> {
        return await this.userService.getMyUserDetails(request.userAuth0Id);
    }

    @UseInterceptors(UserAuthGuardInterceptor)
    @Post("getUserDetails")
    async getUserDetails(@Req() request: RequestWithUserIdInterface, @Body() getUserDetailsDto: GetUserDetailsDto): Promise<User> {
        return await this.userService.getUserDetails(getUserDetailsDto, request.userAuth0Id);
    }

    @UseGuards(UserAuthGuard)
    @FormDataRequest()
    @Post("updateProfilePicture")
    async updateProfilePicture(@Req() request: RequestWithUserIdInterface, @Body() updateProfilePictureDto: any) {
        return await this.userService.updateProfilePicture(request.userAuth0Id, updateProfilePictureDto);
    }

    @UseGuards(UserAuthGuard)
    @Post("updateUserData")
    async updateUserData(@Req() request: RequestWithUserIdInterface, @Body() updateUserDataDto: any) {
        return await this.userService.updateUserData(request.userAuth0Id, updateUserDataDto);
    }

    @UseGuards(UserAuthGuard)
    @Post("deleteUser")
    deleteUser(@Req() request: RequestWithUserIdInterface) {
        return this.userService.deleteUser(request.userAuth0Id);
    }
}
