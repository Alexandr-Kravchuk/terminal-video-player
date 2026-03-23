# Terminal Video Player

A Python application that plays video files directly in your terminal using ASCII characters and full RGB colors.

## Features

- 🎬 Play any video format supported by OpenCV
- 🎨 Full RGB color support using ANSI escape codes
- 📺 Automatic terminal size detection and scaling
- ⚡ Real-time video playback with proper FPS handling
- 🖼️ ASCII art rendering with brightness-based character selection

## Requirements

- Python 3.7+
- OpenCV (opencv-python)

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```bash
python video_player.py <video_file>
```

Example:
```bash
python video_player.py myvideo.mp4
```

## Controls

- **Ctrl+C** - Stop playback

## How it works

1. Reads video frames using OpenCV
2. Resizes each frame to fit terminal dimensions
3. Converts each pixel to:
   - An ASCII character based on brightness
   - RGB color using ANSI escape codes
4. Displays frames with proper timing to maintain original FPS

## Supported Formats

Any video format supported by OpenCV, including:
- MP4
- AVI
- MOV
- MKV
- WebM

## Technical Details

- Uses ANSI 24-bit true color escape codes (`\033[38;2;R;G;Bm`)
- Character set: ` .:-=+*#%@` (from darkest to brightest)
- Automatically adapts to terminal size
- Frame timing synchronized with original video FPS

## License

MIT
