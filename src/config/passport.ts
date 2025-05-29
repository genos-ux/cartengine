import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { prismaClient } from "..";


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY! //secret used to sign the token
}

passport.use(
    new JwtStrategy(opts, async(jwt_payload, done) => {
        try {
            const user = await prismaClient.user.findUnique({
                where: {id: jwt_payload.userId}
            })
            if(user){
                return done(null,user)
            }else{
                return done(null,false);
            }
        } catch (error) {
            return done(error, false);
            
        }

    })
)

export default passport;