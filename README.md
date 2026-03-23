# Terminal Video Player

Watch videos as colored ASCII art in your terminal or browser!

**🌐 [Try it online!](https://alexandr-kravchuk.github.io/terminal-video-player/)**

## Two Versions Available

### 🖥️ Python CLI Version
A Python application that plays video files directly in your terminal using ASCII characters and full RGB colors.

### 🌐 Web Browser Version
A web application accessible through GitHub Pages - no installation required! Watch videos in your browser with the same ASCII art effect.

---

## Web Browser Version

### ✨ Features

- 🎬 **No installation required** - runs entirely in your browser
- 🎨 **Full RGB color support** - beautiful colored ASCII art
- 📁 **Multiple video sources**:
  - Upload video files from your device
  - Load videos from URLs
  - Try the included demo video
- ⚙️ **Customizable settings**:
  - Terminal size (Small, Medium, Large, X-Large)
  - ASCII detail level (Low, Medium, High)
  - Color modes (Full Color, Grayscale, Green Terminal)
  - Loop playback option
- 🎮 **Video controls**: Play, Pause, Stop, Seek, Progress bar
- 📊 **Real-time FPS display**
- 📱 **Responsive design** - works on desktop and mobile

### 🚀 Quick Start

1. Visit: **https://alexandr-kravchuk.github.io/terminal-video-player/**
2. Click "Load Demo" to try the demo video
3. Or upload your own video file
4. Adjust settings to your preference
5. Press Play and enjoy!

### 💻 Technology Stack

- Pure JavaScript (no dependencies)
- Canvas API for video processing
- HTML5 Video element
- CSS3 for terminal styling

---

## Python CLI Version

### ✨ Features

- 🎬 Play any video format supported by OpenCV
- 🎨 Full RGB color support using ANSI escape codes
- 📺 Automatic terminal size detection and scaling
- ⚡ Real-time video playback with proper FPS handling
- 🖼️ ASCII art rendering with brightness-based character selection

### 📋 Requirements

- Python 3.7+
- OpenCV (opencv-python)

### 🔧 Installation

```bash
pip install -r requirements.txt
```

### 🚀 Usage

```bash
python video_player.py <video_file>
```

Example:
```bash
python video_player.py myvideo.mp4
```

### 🎮 Controls

- **Ctrl+C** - Stop playback

### ⚙️ How it works

1. Reads video frames using OpenCV
2. Resizes each frame to fit terminal dimensions
3. Converts each pixel to:
   - An ASCII character based on brightness
   - RGB color using ANSI escape codes
4. Displays frames with proper timing to maintain original FPS

### 🎥 Supported Formats

Any video format supported by OpenCV, including:
- MP4
- AVI
- MOV
- MKV
- WebM

### 🔬 Technical Details

- Uses ANSI 24-bit true color escape codes (`\033[38;2;R;G;Bm`)
- Character set: ` .:-=+*#%@` (from darkest to brightest)
- Automatically adapts to terminal size
- Frame timing synchronized with original video FPS

---

## 📸 Screenshots

### Web Version
![Web Terminal Player](https://via.placeholder.com/800x400?text=Web+Terminal+Player)

### CLI Version
![CLI Terminal Player](https://via.placeholder.com/800x400?text=CLI+Terminal+Player)

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

MIT

---

## 🌟 Star this project!

If you find this project interesting or useful, please give it a star on GitHub!
