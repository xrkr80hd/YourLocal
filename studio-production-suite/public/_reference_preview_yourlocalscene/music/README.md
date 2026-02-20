# Music Folder

Place your MP3 files in this folder for the main audio player.

## Adding tracks to your playlist

1. Add MP3 files to this folder (e.g., `track1.mp3`, `my-song.mp3`)
2. Open `index.html` and find the `playlist` array in the `<script>` section
3. Add entries for each track:

```javascript
const playlist = [
    { title: 'Track Name', artist: 'XRKR80HD', src: 'music/track1.mp3', duration: '3:45' },
    { title: 'Another Song', artist: 'XRKR80HD', src: 'music/my-song.mp3', duration: '4:20' },
];
```

## Subfolder for band archive music

For Memory Lane band music samples, create a `bands/` subfolder inside this `music/` folder:
- `music/bands/band-name-track1.mp3`
- `music/bands/band-name-track2.mp3`

Then update the band page template with the correct paths.
