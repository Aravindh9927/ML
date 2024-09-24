import os
from pathlib import Path
import imageio
from PIL import Image
import time
import random
import string
import datetime


def convert_dng_to_jpg(input_folder, output_folder):
    input_path = Path(input_folder)
    output_path = Path(output_folder)
    output_path.mkdir(parents=True, exist_ok=True)

    # Counter for renaming files
    file_counter = 1

    for dng_file in input_path.glob('*.dng'):
        try:
            # Read the DNG file
            img = imageio.imread(dng_file)

            # Convert to PIL Image
            pil_img = Image.fromarray(img)

            # Save as JPG with new name
            new_filename = f"training_{file_counter:03d}.jpg"
            jpg_file = output_path / new_filename
            pil_img.save(str(jpg_file))
            print(f"Converted {dng_file.name} to {new_filename}")

            # Increment counter
            file_counter += 1
        except Exception as e:
            print(f"Error processing {dng_file.name}: {str(e)}")


def rename_existing_files(folder):
    folder_path = Path(folder)
    files = sorted(folder_path.glob('*.*'))

    for i, file in enumerate(files, start=1):
        new_name = folder_path / f"training_{i:03d}.jpg"
        file.rename(new_name)
        print(f"Renamed {file.name} to {new_name.name}")


# Convert DNG to JPG
# convert_dng_to_jpg(
#     '/Users/gnanavelsubramaniam/Downloads/AmazonPhotos',
#     '/Users/gnanavelsubramaniam/Downloads/training_002'
# )

# Rename existing files in the output folder
# rename_existing_files('/Users/gnanavelsubramaniam/Downloads/training_003')


def rename_files(folder):
    folder_path = Path(folder)
    files = sorted(folder_path.glob('*.*'))

    for file in files:
        timestamp = int(time.time() * 1000)  # Millisecond timestamp
        current_date = datetime.datetime.now().strftime(
            "%Y%m%d")  # Current date in YYYYMMDD format
        random_string = ''.join(random.choices(
            string.ascii_lowercase + string.digits, k=6))
        new_name = folder_path / \
            f"{current_date}_{timestamp}_{random_string}.jpg"

        file.rename(new_name)
        print(f"Renamed {file.name} to {new_name.name}")


# # Rename files in the folder
rename_files('/Users/gnanavelsubramaniam/Downloads/training_003')
