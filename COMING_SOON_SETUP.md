# Coming Soon Page Setup

## Required Images

To enable the Coming Soon page, you need to add the following images to the `public/images/` directory:

### 1. Coming Soon Background Image

- **Path**: `public/images/coming-soon.jpg`
- **Description**: The Mediterranean scene image provided (with "COMING SOON" text and sunset view)
- **Action**: Save the attached image as `coming-soon.jpg` in the `public/images/` folder

### 2. Rotaract Logo

- **Path**: `public/images/rotaract-logo.png`
- **Description**: Official Rotaract Mediterranean logo (transparent background recommended)
- **Action**: Add your Rotaract logo as `rotaract-logo.png` in the `public/images/` folder

## Environment Variable Configuration

### Enable Coming Soon Mode

1. Create or update your `.env.local` file in the project root
2. Add the following line:
   ```
   NEXT_PUBLIC_COMING_SOON=true
   ```

### Disable Coming Soon Mode (Show Full Website)

When you're ready to launch, change the value to:

```
NEXT_PUBLIC_COMING_SOON=false
```

Or simply remove the line entirely.

## How It Works

- When `NEXT_PUBLIC_COMING_SOON=true`, the main page (`app/page.tsx`) displays the Coming Soon component
- When `NEXT_PUBLIC_COMING_SOON=false` or not set, the full homepage with hero slides displays
- The toggle is instant - just change the environment variable and restart the dev server (or rebuild for production)

## Deployment

For production deployment (Vercel):

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add `NEXT_PUBLIC_COMING_SOON` with value `true`
4. Deploy your project
5. When ready to launch, change the value to `false` and redeploy

## Development Testing

```bash
# Start dev server
npm run dev

# The coming soon page will appear if NEXT_PUBLIC_COMING_SOON=true in .env.local
```

After changing the environment variable, restart the development server to see the changes.
