# Card Game Project – Setup Guide

This project uses **Next.js (App Router)**, **Prisma**, and **SQLite**.  
Follow these steps after cloning the repository to get everything working.


## 🚀 1. Install dependencies

Inside the terminal:
npm install


## 🗄️ 2. Create a .env file

Create a file named .env in the project root:

(Make sure the path matches your local folder structure.)
Example:
DATABASE_URL="file:./prisma/dev.db"


## 🔧 3. Generate the Prisma client

npx prisma generate


## 📊 5. Open Prisma Studio (optional)

If you want a UI to view user data, cards, and user-card relations:
npx prisma studio


## ▶️ 6. Start the development server

npm run dev

App will run at:
http://localhost:3000
(Currently http://localhost:3000/players/1)



_______________________________________________________________________________________________________________________________________________________

Guide for if prisma has corruption/errors (can happen when changing up the schema):

1. Press Win + R and type %LOCALAPPDATA%
   
2. Delete each prisma folder, located under:

C:\Users\<your-name>\AppData\Local
and
C:\Users\<your-name>\AppData\Roaming.

3. Delete node_modules with:
   
Remove-Item -Recurse -Force node_modules

4. Try each of these until 1 of them works (the terminal will display an X if it doesn't work):

Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item yarn.lock -ErrorAction SilentlyContinue
Remove-Item pnpm-lock.yaml -ErrorAction SilentlyContinue

5. Reinstall dependencies:

npm install

6. Regenerate prisma client (with explicit schema path as a failsafe):

npx prisma generate --schema=./prisma/schema.prisma

7. Open prisma studio (with explicit schema path as a failsafe) - use this to open prisma studio whenever possible anyway:

npx prisma studio --schema=./prisma/schema.prisma



_______________________________________________________________________________________________________________________________________________________


