import os
import shutil
from sklearn.model_selection import train_test_split


def prepare_yolo_dataset(annotations_path, images_path, output_path, train_ratio=0.7, val_ratio=0.2, test_ratio=0.1):
    # Create directory structure
    for split in ['train', 'val', 'test']:
        os.makedirs(os.path.join(output_path, 'images', split), exist_ok=True)
        os.makedirs(os.path.join(output_path, 'labels', split), exist_ok=True)

    # Get all image files
    image_files = [f for f in os.listdir(
        images_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

    # Split the dataset
    train_val, test = train_test_split(
        image_files, test_size=test_ratio, random_state=42)
    train, val = train_test_split(
        train_val, test_size=val_ratio/(train_ratio+val_ratio), random_state=42)

    # Function to copy files
    def copy_files(file_list, split):
        for file in file_list:
            image_src = os.path.join(images_path, file)
            label_src = os.path.join(
                annotations_path, file.rsplit('.', 1)[0] + '.txt')

            image_dst = os.path.join(output_path, 'images', split, file)
            label_dst = os.path.join(
                output_path, 'labels', split, file.rsplit('.', 1)[0] + '.txt')

            shutil.copy(image_src, image_dst)
            if os.path.exists(label_src):
                shutil.copy(label_src, label_dst)
            else:
                print(f"Warning: Label file not found for {file}")

    # Copy files to respective directories
    copy_files(train, 'train')
    copy_files(val, 'val')
    copy_files(test, 'test')

    print(f"Dataset prepared. Train: {len(train)}, Validation: {
          len(val)}, Test: {len(test)}")

    # Create data.yaml file
    yaml_content = f"""
path: {output_path}
train: images/train
val: images/val
test: images/test

nc: 1
names: ['label']
"""
    with open(os.path.join(output_path, 'data.yaml'), 'w') as f:
        f.write(yaml_content)

    print("data.yaml file created.")


if __name__ == "__main__":
    annotations_path = 'data/yolo_annotations'
    images_path = 'data/virginia_set003'
    output_path = 'data/yolov8_dataset'
    prepare_yolo_dataset(annotations_path, images_path, output_path)
