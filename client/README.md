# YTClone - MERN YouTube Clone

Full-stack YouTube clone built for the capstone requirement using MongoDB, Express, React with Vite, and Node.js.

> **Repository:** 

## For Evaluators

- **Setup** — see [Setup](#setup) below; takes under 5 minutes with `npm run seed`.
- **Features** — see [Feature Checklist](#feature-checklist) and [API Endpoints](#api-endpoints).
- **Usage** — see [Usage Walkthrough](#usage-walkthrough) for a step-by-step
  path through every graded feature (auth, search/filter, video player,
  like/dislike, comment CRUD, channel CRUD).
- **Sample data** — `npm run seed` populates 8 users, 8 channels, ~37 videos
  across all 6 categories, and generated comments. See [Sample Logins](#sample-logins).
  *(covers sign up/login, search & filter, watching a video, like/dislike,
  adding a comment, and creating/editing/deleting a video from your channel)*

## Feature Checklist

| Area | Implemented |
| --- | --- |
| Home page | YouTube-style header, sidebar toggle, search, filter buttons, video thumbnail grid |
| Authentication | Register, login, JWT auth, logout, token rehydration |
| Search | Search videos by title from the header |
| Filters | Six category filters: Web Development, JavaScript, Data Structures, Music, Gaming, Education |
| Video player | HTML video player, title, description, channel link, views, upload date |
| Like/dislike | Authenticated like and dislike toggles with duplicate vote prevention |
| Comments | Add, list, edit, and delete comments on the video page |
| Channel page | Create a channel, show banner/profile info, list channel videos |
| Video management | Create, edit, and delete channel videos |
| Responsive UI | Mobile, tablet, and desktop layouts |
| Seed data | 8 users, 8 channels, 40 videos, 6 categories, generated comments |

## Tech Stack

- Frontend: React 18, Vite, React Router, Axios
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB Atlas or local MongoDB
- Authentication: JWT with bcrypt password hashing
- Validation: express-validator on the backend and form validation on the frontend

## Project Structure

```text
ytclone-mern/
  client/
    src/
      components/
        auth/
        channel/
        comments/
        common/
        layout/
        video/
      constants/
      context/
      hooks/
      pages/
      services/
      styles/
      utils/
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      seed/
      utils/
      validators/
```

## Setup

### Backend

```bash
cd server
npm install
copy .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://mohdraziuddin555_db_user:iYJXDBehJ6oN7xWp@cluster0.ztetuod.mongodb.net/
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Seed the database and start the API:

```bash
npm run seed
npm run dev
```

The API runs at `http://localhost:5000/api`.

### Frontend

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Usage Walkthrough

A quick path through every feature, useful for grading or a first-time look:

1. **Browse without an account** — open `http://localhost:5173`. The home page
   loads the video grid immediately; no login required to watch videos,
   read comments, search by title, or filter by category.
2. **Search & filter** — type into the header search bar (filters the grid
   live by title) or click a category button / sidebar item (Web
   Development, JavaScript, Data Structures, Music, Gaming, Education).
   Click "All" or "Home" to clear the filter.
3. **Sign in** — click **Sign in** (top right). Use one of the seeded
   accounts below, or register a new account — registration redirects you
   to the login page automatically on success.
4. **Confirm you're logged in** — your username now appears next to your
   avatar in the header. Click it to open the dropdown (your channel link,
   sign out).
5. **Watch a video & interact** — click any thumbnail. On the video page you
   can like/dislike (toggles, mutually exclusive), and add/edit/delete your
   own comments. Comments from other seeded users are visible but not
   editable by you — only the comment's author can edit/delete it.
6. **Create your channel** — click your avatar → **Your channel**. If you
   don't have one yet, you'll see a create-channel form (name + handle).
7. **Upload, edit, delete a video** — from your channel page, click
   **+ Upload Video**. Fill in title, description, thumbnail URL, video URL,
   and category, then submit — you're redirected to the new video's page.
   Back on your channel, each of your videos has **Edit** and **Delete**
   buttons (only visible to you, the owner).
8. **Log out** — avatar dropdown → **Sign out**. The header reverts to the
   Sign in button, and write actions (upload, like, comment) become
   unavailable until you log back in.

## Sample Logins

All seeded users use `password123`.

| Email | User |
| --- | --- |
| mohdraziuddin123@gmail.com | 123456789 |
| shaishta123@gmail.com | 123456789 |
| alex@example.com | alex_builds |
| nikhil@example.com | nikhil_xo |
| sara@example.com | sara_music |
| dev@example.com | dev_anon |
| rahul@example.com | gamer_rahul |
| learn@example.com | learnwithme |

## API Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Register with username, email, password |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/videos` | No | List videos, supports `search` and `category` query params |
| GET | `/api/videos/:id` | No | Fetch one video and increment views |
| POST | `/api/videos` | Yes | Create a video for the signed-in user's channel |
| PUT | `/api/videos/:id` | Yes | Update own video |
| DELETE | `/api/videos/:id` | Yes | Delete own video |
| POST | `/api/videos/:id/like` | Yes | Toggle like |
| POST | `/api/videos/:id/dislike` | Yes | Toggle dislike |
| POST | `/api/channels` | Yes | Create a channel |
| GET | `/api/channels/:id` | No | Fetch channel details and videos |
| PUT | `/api/channels/:id` | Yes | Update own channel |
| GET | `/api/comments/video/:videoId` | No | List comments for a video |
| POST | `/api/comments` | Yes | Add comment |
| PUT | `/api/comments/:id` | Yes | Edit own comment |
| DELETE | `/api/comments/:id` | Yes | Delete own comment |

## Notes

- Video files are stored as URLs, not uploaded files.
- Nested comments are intentionally excluded, matching the assignment brief.
- The channel page supports video create, read, update, and delete workflows.
- Use `npm run seed` before evaluation so MongoDB has users, channels, videos, and comments.


## AUTHOR

Mohd Raziuddin