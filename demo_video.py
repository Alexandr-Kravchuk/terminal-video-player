import cv2
import numpy as np

width, height = 320, 240
fps = 30
duration = 3

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter('demo.mp4', fourcc, fps, (width, height))

for frame_num in range(fps * duration):
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    
    t = frame_num / fps
    
    colors = [
        (255, 0, 0),
        (0, 255, 0),
        (0, 0, 255),
        (255, 255, 0),
        (255, 0, 255),
        (0, 255, 255),
    ]
    
    for i, color in enumerate(colors):
        angle = (t * 2 + i * 60) % 360
        rad = np.radians(angle)
        cx = int(width / 2 + width / 3 * np.cos(rad))
        cy = int(height / 2 + height / 3 * np.sin(rad))
        cv2.circle(frame, (cx, cy), 30, color, -1)
    
    gradient = np.linspace(0, 255, width).astype(np.uint8)
    gradient = np.tile(gradient, (height, 1))
    frame[:, :, 0] = np.bitwise_or(frame[:, :, 0], gradient // 4)
    frame[:, :, 1] = np.bitwise_or(frame[:, :, 1], gradient // 3)
    frame[:, :, 2] = np.bitwise_or(frame[:, :, 2], gradient // 2)
    
    cv2.putText(frame, f"Frame {frame_num + 1}/{fps * duration}", 
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    
    out.write(frame)

out.release()
print("Demo video created: demo.mp4")
