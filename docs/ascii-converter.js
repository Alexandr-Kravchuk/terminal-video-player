class ASCIIConverter {
    constructor() {
        this.charSets = {
            low: ' .:-=+*#%@',
            medium: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
            high: ' .\'-,:;!>i+=ltcsz7?YJXFQE93&$B#@'
        };
        
        this.currentCharSet = this.charSets.medium;
        this.colorMode = 'color';
    }

    setCharSet(detail) {
        this.currentCharSet = this.charSets[detail] || this.charSets.medium;
    }

    setColorMode(mode) {
        this.colorMode = mode;
    }

    frameToASCII(imageData, width, height) {
        const pixels = imageData.data;
        const chars = [];
        const colors = [];
        
        for (let y = 0; y < height; y++) {
            const rowChars = [];
            const rowColors = [];
            
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = pixels[idx];
                const g = pixels[idx + 1];
                const b = pixels[idx + 2];
                
                const brightness = (r + g + b) / 3;
                const charIndex = Math.min(
                    Math.floor(brightness * this.currentCharSet.length / 256),
                    this.currentCharSet.length - 1
                );
                const char = this.currentCharSet[charIndex];
                
                rowChars.push(char);
                rowColors.push(this.getColor(r, g, b));
            }
            
            chars.push(rowChars);
            colors.push(rowColors);
        }
        
        return { chars, colors };
    }

    getColor(r, g, b) {
        switch (this.colorMode) {
            case 'grayscale': {
                const gray = Math.floor((r + g + b) / 3);
                return `rgb(${gray},${gray},${gray})`;
            }
            case 'green': {
                const brightness = Math.floor((r + g + b) / 3);
                return `rgb(0,${brightness},0)`;
            }
            case 'color':
            default:
                return `rgb(${r},${g},${b})`;
        }
    }

    renderToHTML(asciiData) {
        const { chars, colors } = asciiData;
        const lines = [];
        
        for (let y = 0; y < chars.length; y++) {
            const lineParts = [];
            for (let x = 0; x < chars[y].length; x++) {
                const char = chars[y][x];
                const color = colors[y][x];
                lineParts.push(`<span style="color:${color}">${char}</span>`);
            }
            lines.push(lineParts.join(''));
        }
        
        return lines.join('\n');
    }

    renderToCanvas(asciiData, ctx, charWidth, charHeight) {
        const { chars, colors } = asciiData;
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        for (let y = 0; y < chars.length; y++) {
            for (let x = 0; x < chars[y].length; x++) {
                ctx.fillStyle = colors[y][x];
                ctx.fillText(chars[y][x], x * charWidth, y * charHeight);
            }
        }
    }

    renderToText(asciiData) {
        const { chars } = asciiData;
        return chars.map(row => row.join('')).join('\n');
    }
}
