import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {GetUserDetailsDto, User} from "../entities/User/User";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private configService: ConfigService
    ) {
    }

    async adminGetAllUsers(getAllUsers: any) {
        return await this.userRepository.find();
    }

    async isUserAccountCreated(userId: string): Promise<any> {
        const user = await this.userRepository.findOne({where: {auth0Id: userId}});
        return {accountExists: (user != null)};
    }

    async initialUserSetup(userId: string, initialUserSetupRequestDto: any) {
        let user = await this.userRepository.findOne({where: {auth0Id: userId}});
        if (user == null) {
            user = new User();
            user.auth0Id = userId;
        }
        user.name = initialUserSetupRequestDto.name;
        user.description = initialUserSetupRequestDto.description;
        user.birthDate = new Date(initialUserSetupRequestDto.birthDate);
        // user.image = this.configService.get<string>("uploadedFileUrl") + "/ " + initialUserSetupRequestDto.file.path.split(".").last;
        await this.userRepository.save(user);
    }

    async getMyUserDetails(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {auth0Id: userId},
            relations: {
                createdPostLikes: {
                    post: {}
                },
                createdPostComments: {
                    post: {}
                },
                createdPosts: {
                    postLikes: {},
                },
                createdPostSubComments: {}
            }
        });
        if (user.createdPosts != null) {
            user.createdPosts.forEach((post) => {
                user.upvoteCount = user.upvoteCount + post.postLikes.length;
            });
        }
        return user;
    }

    async getUserDetails(getUserDetailsDto: GetUserDetailsDto, userAuth0id: string) {
        const user = await this.userRepository.findOne({
            where: {id: getUserDetailsDto.userId},
            relations: {
                createdPostLikes: {
                    post: {}
                },
                createdPostComments: {
                    post: {}
                },
                createdPosts: {
                    postLikes: {}
                },
                createdPostSubComments: {}
            }
        });
        user.createdPosts.forEach((post) => {
            user.upvoteCount = user.upvoteCount + post.postLikes.length;
        });
        if (userAuth0id != null && userAuth0id != "") {
            // user.followers.forEach((follower) => {
            //     if (follower.creatorUser.auth0Id == userAuth0id) {
            //         user.iAmFollowing = true;
            //     }
            // });
            // for (let i = 0; i < user.beenBlockedBy.length; i++) {
            //     const blockedByUser = user.beenBlockedBy[i];
            //     if (blockedByUser.creatorUser != null && blockedByUser.creatorUser.auth0Id == userAuth0id) {
            //         user.isBlocked = true;
            //     }
            // }
        }
        return user;
    }

    async updateProfilePicture(userAuth0Id: string, updateProfilePictureDto: any) {
        const user = await this.userRepository.findOne({where: {auth0Id: userAuth0Id}});
        user.image = this.configService.get<string>("default.uploadedFileUrl") + "/" + updateProfilePictureDto.image.path.split("/").slice(-1)[0];
        await this.userRepository.save(user);
    }

    async updateUserData(userAuth0Id: string, updateUserDataDto: any) {
        const user = await this.userRepository.findOne({where: {auth0Id: userAuth0Id}});
        user.name = updateUserDataDto.name;
        user.description = updateUserDataDto.description;
        await this.userRepository.save(user);
    }

    async deleteUser(userAuth0Id: string) {
        const user = await this.userRepository.findOne({where: {auth0Id: userAuth0Id}});
        user.auth0Id = "";
        await this.userRepository.save(user);
        await this.userRepository.softRemove(user);
    }
}
