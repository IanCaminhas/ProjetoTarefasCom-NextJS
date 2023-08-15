import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google'
/*
    clientId e clientSecret imaginam que podem receber uma stirng proveniente do arquivo .env
    ou undefined. Como eu tenho certeza que as duas propriedades estão preenchidas, forço colocando o 
    as string em cada propriedade
*/
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    secret: process.env.JWT_SECRET as string,
}

export default NextAuth(authOptions)