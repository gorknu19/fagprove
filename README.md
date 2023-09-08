# Tools used in this project

- [NextJS](https://nextjs.org) - [TypeScript](https://www.typescriptlang.org)
- [Prisma](https://www.prisma.io)
- [Postgresql](https://www.postgresql.org)
- [Next-Auth](https://next-auth.js.org)
- [TailwindCSS](https://tailwindcss.com)


## Getting Started

### Requirements for this project
Install [NodeJS](https://nodejs.org/en/download) and [Docker](https://www.docker.com)


___
1. Open your command prompt and clone repository.
```
git clone https://github.com/gorknu19/fagprove.git
```

2. Install Packages
```
cd /fagprove/
npm install
```

3. Create a file named `.env` in root of this project and set up enviroment variables
```
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
SECRET=
NEXTAUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET= 

DATABASE_URL=postgresql://admin:PASSWORD@localhost:PORT/nextauth_prisma?schema=public
```
4.
```
docker compose up -d

```

5. Generate prisma schema and push
```
prisma generate
prisma db push
```

6. 

Create the folder  C:\\verktoy-filer this is where images get uploaded, this can be changed to another folder but then you need to change the code too

Once finished, run the website
```
npm run dev
```
