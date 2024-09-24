import json
import os
from shapely.geometry import Polygon
from PIL import Image


def polygon_to_bbox(points):
    polygon = Polygon(zip(points[::2], points[1::2]))
    minx, miny, maxx, maxy = polygon.bounds
    return [minx, miny, maxx, maxy]
    

def get_image_path(image_folder, image_id):
    for ext in ['jpg', 'jpeg', 'JPG']:
        path = os.path.join(image_folder, f"{image_id}.{ext}")
        if os.path.exists(path):
            return path
    return None


def get_image_size(image_path):
    with Image.open(image_path) as img:
        return img.size


def convert_to_yolo(input_file, output_folder, image_folder):
    with open(input_file, 'r') as f:
        data = json.load(f)

    for item in data['items']:
        image_id = item['id']
        image_path = get_image_path(image_folder, image_id)

        if not image_path:
            print(f"Warning: Image file for {image_id} not found. Skipping...")
            continue

        image_width, image_height = get_image_size(image_path)
        output_file = os.path.join(output_folder, f"{image_id}.txt")

        yolo_annotations = []

        for annotation in item['annotations']:
            if annotation['type'] == 'polygon':
                bbox = polygon_to_bbox(annotation['points'])
                x_center = (bbox[0] + bbox[2]) / 2 / image_width
                y_center = (bbox[1] + bbox[3]) / 2 / image_height
                width = (bbox[2] - bbox[0]) / image_width
                height = (bbox[3] - bbox[1]) / image_height

                # Assuming all polygons are of class 0 (you may need to adjust this)
                class_id = 0

                yolo_annotations.append(f"{class_id} {x_center:.6f} {
                                        y_center:.6f} {width:.6f} {height:.6f}")

        with open(output_file, 'w') as f:
            f.write('\n'.join(yolo_annotations))

        print(f"Processed {image_id}")


# Usage
input_file = 'data/annotations/default_9.json'
output_folder = 'data/yolo_annotations'
image_folder = 'data/virginia_set003'

# Create output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

convert_to_yolo(input_file, output_folder, image_folder)
