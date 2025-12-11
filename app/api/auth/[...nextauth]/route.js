import NextAuth from 'next-auth'

const handler = NextAuth({
  providers: [
    {
      id: 'email',
      type: 'email',
      revalidate: true,
    },
    {
      id: 'reddit',
      name: 'Reddit',
      type: 'oauth',
      version: '2.0',
      scope: 'identity',
      authorization: 'https://www.reddit.com/api/v1/authorize',
      token: 'https://www.reddit.com/api/v1/access_token',
      userInfo: 'https://api.reddit.com/api/v1/me',
      profile: (profile) => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.icon_img,
      }),
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
    },
  ],
  secret: process.env.NEXTAUTH_SECRET || 'defaultSecret', // Use environment variable or fallback
})

export { handler as GET, handler as POST }
