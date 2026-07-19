# UniVerse

A university campus marketplace — buy, sell, and chat with other students. Browse listings, post items for sale, save favorites, leave reviews, and message sellers in real time.

## Tech stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Real-time:** Socket.io (chat)
- **Auth:** JWT + email OTP verification
- **Images:** Cloudinary
- **Email:** Nodemailer (SMTP)

## Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier is fine) — grab the connection string
- A [Cloudinary](https://cloudinary.com) account (free tier) — for listing photos and avatars
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) — for sending OTP emails (or any other SMTP provider)

## Setup

### 1. Clone and install

```bash
git clone <this-repo-url>
cd universe

cd backend && npm install
cd ../frontend && npm install
```

### 2. Backend environment

Copy `backend/.env.example` to `backend/.env` and fill in:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_FROM="UniVerse <your_gmail_address@gmail.com>"

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Frontend environment

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run both servers

```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll land on the login/signup page first — create an account, verify the OTP sent to your email, then you're in.

## Features

- University-verified signup with email OTP
- Browse, search, and filter marketplace listings (with custom categories)
- Post items for sale with photos (Cloudinary), featured listings
- Save items, leave reviews and ratings on sellers
- Real-time chat with typing indicators and read receipts (Socket.io)
- Clear conversation / delete chat
- Notifications for messages, saves, and reviews
- Campus events board
- Edit/delete your own listings

## Notes for contributors

- `backend/.env` and `frontend/.env.local` are gitignored — never commit real credentials, use the `.env.example` files as a template.
- The backend seeds nothing by default — the app starts empty until users sign up and start posting.
