#!/usr/bin/env python3

import cv2
import sys
import os
import time
from dataclasses import dataclass

ASCII_CHARS = " .:-=+*#%@"

@dataclass
class TerminalSize:
    width: int
    height: int

def get_terminal_size():
    size = os.get_terminal_size()
    return TerminalSize(width=size.columns, height=size.lines - 1)

def rgb_to_ansi(r, g, b):
    return f"\033[38;2;{r};{g};{b}m"

def reset_color():
    return "\033[0m"

def frame_to_ascii(frame, width, height):
    frame_resized = cv2.resize(frame, (width, height))
    
    output = []
    for row in frame_resized:
        line = ""
        for pixel in row:
            b, g, r = int(pixel[0]), int(pixel[1]), int(pixel[2])
            brightness = (r + g + b) // 3
            char_index = min(brightness * len(ASCII_CHARS) // 256, len(ASCII_CHARS) - 1)
            char = ASCII_CHARS[char_index]
            line += rgb_to_ansi(r, g, b) + char + reset_color()
        output.append(line)
    
    return "\n".join(output)

def clear_screen():
    print("\033[2J\033[H", end="")

def play_video(video_path):
    if not os.path.exists(video_path):
        print(f"Error: Video file '{video_path}' not found")
        return
    
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print(f"Error: Cannot open video file '{video_path}'")
        return
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_delay = 1.0 / fps if fps > 0 else 1.0 / 30
    
    terminal_size = get_terminal_size()
    
    print(f"Playing: {video_path}")
    print(f"FPS: {fps:.2f}")
    print(f"Terminal size: {terminal_size.width}x{terminal_size.height}")
    print("Press Ctrl+C to stop")
    time.sleep(2)
    
    try:
        frame_count = 0
        start_time = time.time()
        
        while True:
            ret, frame = cap.read()
            
            if not ret:
                break
            
            ascii_frame = frame_to_ascii(frame, terminal_size.width, terminal_size.height)
            
            clear_screen()
            print(ascii_frame)
            
            frame_count += 1
            elapsed = time.time() - start_time
            expected_time = frame_count * frame_delay
            sleep_time = expected_time - elapsed
            
            if sleep_time > 0:
                time.sleep(sleep_time)
    
    except KeyboardInterrupt:
        print("\n\nPlayback stopped by user")
    finally:
        cap.release()
        print(f"\nTotal frames: {frame_count}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python video_player.py <video_file>")
        print("\nExample:")
        print("  python video_player.py video.mp4")
        sys.exit(1)
    
    video_path = sys.argv[1]
    play_video(video_path)

if __name__ == "__main__":
    main()
