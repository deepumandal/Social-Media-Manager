# Social Media Manager Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=social_media_manager
DB_PORT=3306

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/api/auth/linkedin/callback

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

1. Install MySQL and create a database named `social_media_manager`
2. The application will automatically create the required tables on first run

## LinkedIn OAuth Setup

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Add the redirect URI: `http://localhost:3000/api/auth/linkedin/callback`
4. Copy the Client ID and Client Secret to your environment variables

## Running the Application

1. Install dependencies: `pnpm install`
2. Set up your environment variables
3. Start the development server: `pnpm dev`
4. Open http://localhost:3000

## Features

- **Authentication**: Login with admin credentials
- **Post Creation**: Create posts with rich text styling
- **Post Scheduling**: Schedule posts for future publishing
- **LinkedIn Integration**: Connect LinkedIn account for posting
- **Post Management**: Edit and delete scheduled posts

## Usage

1. Login with your admin credentials
2. Connect your LinkedIn account
3. Create posts with custom styling
4. Schedule posts for future publishing
5. Manage your scheduled posts
