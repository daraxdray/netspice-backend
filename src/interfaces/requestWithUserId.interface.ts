interface RequestWithUserIdInterface extends Request {
    userAuth0Id: string
}

interface RequestWithAdminUserIdInterface extends Request {
    adminUserAuth0Id: string
}