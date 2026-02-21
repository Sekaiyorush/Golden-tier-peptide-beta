from PIL import Image

def crop_transparent(img_path, output_path):
    img = Image.open(img_path).convert("RGBA")
    # Get bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        img_cropped = img.crop(bbox)
        img_cropped.save(output_path)
        print(f"Cropped successfully to {bbox}")
    else:
        print("Image is entirely transparent!")

crop_transparent(r"C:\Users\USER\.gemini\antigravity\scratch\Golden-tier-peptide revision\public\brand-logo-gold.png", r"C:\Users\USER\.gemini\antigravity\scratch\Golden-tier-peptide revision\public\brand-logo-gold.png")
