# Images Folder

Store all images for your site here.

## Folder structure

```
images/
├── profile.jpg         # Your photo for the About section
├── band-name.jpg       # Band card images for Memory Lane
├── another-band.jpg
└── gallery/            # Subfolder for band photo galleries
    ├── band-name-1.jpg
    ├── band-name-2.jpg
    └── ...
```

## Recommended image sizes

- **Band card images**: 800x500px (16:10 aspect ratio)
- **Profile photo**: 600x600px (square)
- **Band page hero**: 800x800px (square)
- **Gallery photos**: 800x600px (4:3 aspect ratio)

## Adding images

1. Save images to this folder
2. Update the HTML to reference them:
   - Band cards: `<img src="images/band-name.jpg" alt="Band Name">`
   - Profile: `<img src="images/profile.jpg" alt="Your Name">`
   - Gallery: `<img src="images/gallery/photo1.jpg" alt="Description">`

## Supported formats

- JPG/JPEG (recommended for photos)
- PNG (good for logos with transparency)
- WebP (modern, smaller file sizes)
