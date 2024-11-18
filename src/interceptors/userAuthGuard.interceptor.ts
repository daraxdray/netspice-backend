import {CallHandler, ExecutionContext, Injectable, NestInterceptor,} from '@nestjs/common';
import {map} from 'rxjs';

const jwt = require('jsonwebtoken');

@Injectable()
export class UserAuthGuardInterceptor implements NestInterceptor {

    async getAuth0IdFromJwtToken(jwtToken): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.verify(jwtToken, "put-public-cert-to-verify-jwt-here", null, ((err, decoded) => {
                    if (err != null) {
                        resolve(null);
                    } else {
                        // @ts-ignore
                        resolve(decoded['sub']);
                    }
                })
            );
        });
    }

    public async intercept(
        _context: ExecutionContext,
        next: CallHandler
    ): Promise<any> {

        // changing request
        let request = _context.switchToHttp().getRequest();
        const jwtToken = request.headers['authorization'];
        request.userAuth0Id = await this.getAuth0IdFromJwtToken(jwtToken);

        return next.handle().pipe(
            map((flow) => {
                return flow;
            })
        );
    }

}
