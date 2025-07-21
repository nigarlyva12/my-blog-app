📝 The Stacked Dev – Personal Blog Project

Welcome to The Stacked Dev — a blog that exists mostly so I could avoid real responsibilities by writing code and pretending I’m doing something important. It’s built with Node.js, Express, MongoDB, and a sprinkle of Pug because I apparently like writing HTML in reverse.

🚀 Features
User authentication (local + Google, because why not complicate things?)

Admin dashboard for posting blogs (only for the elite)

Blog creation, editing, deletion (for said elite)

Public blog listing and details page

Search functionality — because scrolling is hard (tbh not working now, lazy to correct #for now okay?#)

Responsive layout (yes, it works on your phone too)


🧰 Stack
Backend: Node.js, Express

Database: MongoDB + Mongoose

Templating: Pug (sorry, not sorry)

Authentication: Passport.js

Session storage: MongoDB via connect-mongo

Styling: Plain CSS (fancy enough for now)

🔧 Setup
Clone this repository (because you're curious or bored):

git clone https://github.com/your-username/the-stacked-dev.git
cd the-stacked-dev
npm install
Create a .env file with the following (fill in your secrets):

PORT=3000 
MONGO_URI=your_mongodb_connection_string
SESSION_KEY=some_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

Run it:

npm start

Then visit: http://localhost:3000

You’re live! Well, locally.

🙋‍♂️ Why This Exists
Mostly to learn full-stack basics, Passport.js, and figure out how badly I can mess up session management before giving up. Spoiler: it works. but everyday I need to fix an error lol

📸 Screenshot
You know what a blog looks like — imagine that, but mine.
