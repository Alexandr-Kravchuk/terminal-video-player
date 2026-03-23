class VideoPlayer {
    constructor() {
        this.video = document.getElementById('videoElement');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.terminal = document.getElementById('terminal');
        this.converter = new ASCIIConverter();
        
        this.isPlaying = false;
        this.animationFrameId = null;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fpsInterval = 1000 / 30;
        
        this.terminalSizes = {
            small: { width: 80, height: 24 },
            medium: { width: 120, height: 40 },
            large: { width: 160, height: 60 },
            xlarge: { width: 200, height: 80 }
        };
        
        this.currentSize = this.terminalSizes.medium;
        
        this.initializeControls();
        this.initializeVideoEvents();
    }

    initializeControls() {
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());
        document.getElementById('videoFile').addEventListener('change', (e) => this.loadFile(e));
        document.getElementById('loadUrlBtn').addEventListener('click', () => this.loadURL());
        document.getElementById('loadDemoBtn').addEventListener('click', () => this.loadDemo());
        document.getElementById('progressBar').addEventListener('input', (e) => this.seek(e));
        
        document.getElementById('terminalSize').addEventListener('change', (e) => {
            this.currentSize = this.terminalSizes[e.target.value];
        });
        
        document.getElementById('asciiDetail').addEventListener('change', (e) => {
            this.converter.setCharSet(e.target.value);
        });
        
        document.getElementById('colorMode').addEventListener('change', (e) => {
            this.converter.setColorMode(e.target.value);
        });
        
        document.getElementById('loopVideo').addEventListener('change', (e) => {
            this.video.loop = e.target.checked;
        });
        
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    }

    toggleFullscreen() {
        const container = document.querySelector('.terminal-container');
        
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
                alert('Could not enable fullscreen mode: ' + err.message);
            });
        } else {
            document.exitFullscreen();
        }
    }

    handleFullscreenChange() {
        const btn = document.getElementById('fullscreenBtn');
        if (document.fullscreenElement) {
            btn.textContent = '⛶ Exit Fullscreen';
        } else {
            btn.textContent = '⛶ Fullscreen';
        }
    }

    initializeVideoEvents() {
        this.video.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay();
            document.getElementById('progressBar').max = this.video.duration;
        });
        
        this.video.addEventListener('canplay', () => {
            console.log('Video is ready to play');
        });
        
        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            const errorMsg = this.video.error ? this.video.error.message : 'Unknown error';
            this.terminal.innerHTML = `<span style="color:#ff0000">Error loading video: ${errorMsg}</span>`;
        });
        
        this.video.addEventListener('timeupdate', () => {
            if (!this.seeking) {
                document.getElementById('progressBar').value = this.video.currentTime;
                this.updateTimeDisplay();
            }
        });
        
        this.video.addEventListener('ended', () => {
            if (!this.video.loop) {
                this.stop();
            }
        });
    }

    loadFile(event) {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            this.loadVideoSource(url);
        }
    }

    loadURL() {
        const url = document.getElementById('videoUrl').value.trim();
        if (url) {
            this.loadVideoSource(url);
        }
    }

    loadDemo() {
        this.loadVideoSource('demo.mp4');
    }

    loadVideoSource(src) {
        this.stop();
        this.video.src = src;
        this.video.load();
        this.terminal.innerHTML = '<span style="color:#00ff00">Video loaded. Press Play to start...</span>';
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    async play() {
        if (!this.video.src) {
            alert('Please load a video first!');
            return;
        }
        
        try {
            this.isPlaying = true;
            await this.video.play();
            document.getElementById('playPauseBtn').textContent = '⏸ Pause';
            this.lastFrameTime = performance.now();
            this.frameCount = 0;
            this.renderLoop();
            this.startFPSCounter();
        } catch (error) {
            console.error('Error playing video:', error);
            this.isPlaying = false;
            alert('Error playing video: ' + error.message);
        }
    }

    pause() {
        this.isPlaying = false;
        this.video.pause();
        document.getElementById('playPauseBtn').textContent = '▶ Play';
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        if (this.fpsCounterInterval) {
            clearInterval(this.fpsCounterInterval);
            this.fpsCounterInterval = null;
        }
    }

    stop() {
        this.pause();
        this.video.currentTime = 0;
        this.terminal.innerHTML = '';
        document.getElementById('progressBar').value = 0;
        this.updateTimeDisplay();
        document.getElementById('fpsDisplay').textContent = 'FPS: 0';
    }

    seek(event) {
        this.seeking = true;
        this.video.currentTime = event.target.value;
        setTimeout(() => { this.seeking = false; }, 100);
    }

    renderLoop() {
        if (!this.isPlaying) return;
        
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;
        
        if (elapsed > this.fpsInterval) {
            this.lastFrameTime = now - (elapsed % this.fpsInterval);
            this.renderFrame();
            this.frameCount++;
        }
        
        this.animationFrameId = requestAnimationFrame(() => this.renderLoop());
    }

    renderFrame() {
        if (this.video.paused || this.video.ended) return;
        
        this.canvas.width = this.currentSize.width;
        this.canvas.height = this.currentSize.height;
        
        this.ctx.drawImage(
            this.video,
            0, 0,
            this.canvas.width,
            this.canvas.height
        );
        
        const imageData = this.ctx.getImageData(
            0, 0,
            this.canvas.width,
            this.canvas.height
        );
        
        const asciiData = this.converter.frameToASCII(
            imageData,
            this.currentSize.width,
            this.currentSize.height
        );
        
        this.terminal.innerHTML = this.converter.renderToHTML(asciiData);
    }

    startFPSCounter() {
        let lastCount = 0;
        this.fpsCounterInterval = setInterval(() => {
            const fps = this.frameCount - lastCount;
            lastCount = this.frameCount;
            document.getElementById('fpsDisplay').textContent = `FPS: ${fps}`;
        }, 1000);
    }

    updateTimeDisplay() {
        const current = this.formatTime(this.video.currentTime || 0);
        const duration = this.formatTime(this.video.duration || 0);
        document.getElementById('timeDisplay').textContent = `${current} / ${duration}`;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VideoPlayer();
});
