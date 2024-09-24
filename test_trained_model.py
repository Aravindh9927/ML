import os
from pathlib import Path
from ultralytics import YOLO
from PIL import Image, ImageDraw


def get_latest_model():
    base_dir = Path('runs')
    train_dirs = [d for d in base_dir.iterdir() if d.is_dir()
                  and d.name.startswith('train')]

    all_exp_dirs = []
    for train_dir in train_dirs:
        exp_dirs = [d for d in train_dir.iterdir() if d.is_dir()
                    and d.name.startswith('exp')]
        all_exp_dirs.extend(exp_dirs)

    if not all_exp_dirs:
        raise FileNotFoundError("No experiment directories found")

    latest_exp = max(all_exp_dirs, key=os.path.getmtime)
    model_path = latest_exp / 'weights' / 'best.pt'
    return str(model_path)


# Get and print the latest model path
latest_model = 'runs/detect/train4/weights/best.pt'
print(f"Best model path: {latest_model}")

# Load the model
model = YOLO(latest_model)

# Test the model on the image
test_image_path = 'test/img/Image.jpeg'
results = model(test_image_path, save=True, save_txt=True)

# Open the image using PIL
image = Image.open(test_image_path)
draw = ImageDraw.Draw(image)

# Print the results and draw bounding boxes
print(f"Detection results for {test_image_path}:")
for result in results:
    boxes = result.boxes
    for box in boxes:
        # Get box coordinates
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        # Draw rectangle
        draw.rectangle([x1, y1, x2, y2], outline="red", width=2)
        # Optionally, draw label
        if box.cls is not None:
            class_id = int(box.cls.item())
            confidence = box.conf.item()
            label = f"{model.names[class_id]} {confidence:.2f}"
            draw.text((x1, y1 - 10), label, fill="red")

    print(boxes)  # print detection boxes
    print(result.masks)  # print segmentation masks if available
    print(result.probs)  # print classification probabilities if available

# Show the image with bounding boxes
image.show()

# Optionally, save the image with bounding boxes
image.save('test/image_1_with_boxes.jpeg')
