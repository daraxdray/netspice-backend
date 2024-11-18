import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';

const jwt = require('jsonwebtoken');

@Injectable()
export class UserAuthGuard implements CanActivate {

    constructor() {

    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const request = context.switchToHttp().getRequest<Request>();
            const jwtToken = request.headers['authorization'];
            jwt.verify(jwtToken,"placeholder", null, ((err, decoded) => {
                    if (err != null) {
                        reject(false);
                    } else {
                        // @ts-ignore
                        request.userAuth0Id = decoded['sub'];
                        resolve(true);
                    }
                })
            );
        });
    }
}
