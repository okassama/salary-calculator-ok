# Icon Setup for OK Salary & Budget

## Adding Your Local Icon

To use your local icon file with the Docker deployment, follow these steps:

### 1. Prepare Your Icon Files

Place your icon files in the `public/` directory with these names:

- `favicon.ico` (32x32 pixels, ICO format)
- `favicon-16x16.png` (16x16 pixels, PNG format)
- `favicon-32x32.png` (32x32 pixels, PNG format)
- `apple-touch-icon.png` (180x180 pixels, PNG format)

### 2. Icon File Requirements

- **favicon.ico**: Traditional favicon format (32x32 pixels)
- **PNG files**: Multiple sizes for different devices and browsers
- **Apple Touch Icon**: For iOS home screen (180x180 pixels)

### 3. Recommended Tools

You can create these files using:
- Online favicon generators (like favicon.io)
- Image editing software (Photoshop, GIMP, etc.)
- Icon conversion tools

### 4. Docker Deployment

Once you add your icon files to the `public/` directory, they will be automatically included when you build and deploy with Docker:

```bash
# Build the Docker image
docker build -t ok-salary-budget .

# Run the container
docker run -p 7770:7770 ok-salary-budget
```

### 5. Testing

After deployment, visit your app and check that:
- The browser tab shows your custom icon
- The icon appears correctly when bookmarked
- Mobile devices display the proper icon

### Current Configuration

The app is already configured to use these icon files:
- HTML references all icon formats
- Web manifest for PWA support
- Docker serves all static assets correctly

### Troubleshooting

If icons don't appear:
1. Check file names match exactly
2. Verify file sizes and formats
3. Clear browser cache
4. Check browser developer tools for 404 errors

Your local icon will now be used when the app is deployed via Docker!
