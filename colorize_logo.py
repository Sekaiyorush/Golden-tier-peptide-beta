from PIL import Image, ImageDraw
import numpy as np

# Load image and convert to RGBA
img = Image.open(r'C:\Users\USER\.gemini\antigravity\brain\ba68a1a6-36cd-475b-be10-dee0b52944ce\media__1771706465883.png').convert('RGBA')
arr = np.array(img)

# Assuming it's black text on white background or transparent background
# Let's find black pixels and make white ones transparent
r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]

# Create a mask for dark pixels (non-white)
# Threshold for darkness, say < 128 is logo
mask = (r < 128) & (g < 128) & (b < 128) & (a > 0)

# Make non-logo pixels transparent
arr[~mask] = [0, 0, 0, 0]

# Now for the masked area, apply a shiny gold gradient based on y coordinate
height, width = arr.shape[:2]

# Gold colors for the gradient
# Let's define a few stops: light gold, standard gold, dark gold
colors = [
    (245, 230, 160), # Top highlight
    (212, 175, 55),  # Base Gold
    (180, 130, 25),  # Darker Gold
    (255, 240, 180), # Reflection
    (160, 110, 20)   # Shadow
]

for y in range(height):
    # Normalized y
    ny = y / float(height)
    
    # Simple multi-stop gradient
    if ny < 0.25:
        r_c = np.interp(ny, [0, 0.25], [colors[0][0], colors[1][0]])
        g_c = np.interp(ny, [0, 0.25], [colors[0][1], colors[1][1]])
        b_c = np.interp(ny, [0, 0.25], [colors[0][2], colors[1][2]])
    elif ny < 0.5:
        r_c = np.interp(ny, [0.25, 0.5], [colors[1][0], colors[2][0]])
        g_c = np.interp(ny, [0.25, 0.5], [colors[1][1], colors[2][1]])
        b_c = np.interp(ny, [0.25, 0.5], [colors[1][2], colors[2][2]])
    elif ny < 0.75:
        r_c = np.interp(ny, [0.5, 0.75], [colors[2][0], colors[3][0]])
        g_c = np.interp(ny, [0.5, 0.75], [colors[2][1], colors[3][1]])
        b_c = np.interp(ny, [0.5, 0.75], [colors[2][2], colors[3][2]])
    else:
        r_c = np.interp(ny, [0.75, 1.0], [colors[3][0], colors[4][0]])
        g_c = np.interp(ny, [0.75, 1.0], [colors[3][1], colors[4][1]])
        b_c = np.interp(ny, [0.75, 1.0], [colors[3][2], colors[4][2]])
        
    # Apply to row where mask is true
    row_mask = mask[y, :]
    arr[y, row_mask, 0] = r_c
    arr[y, row_mask, 1] = g_c
    arr[y, row_mask, 2] = b_c
    arr[y, row_mask, 3] = 255 # Full alpha for the logo

img_out = Image.fromarray(arr)
img_out.save(r'C:\Users\USER\.gemini\antigravity\scratch\Golden-tier-peptide revision\public\brand-logo-gold.png')
print("Logo processed successfully")
