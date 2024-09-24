from ultralytics import YOLO
import yaml


def on_train_epoch_end(trainer):
    print(f"Epoch {trainer.epoch} completed. Current metrics:")
    for k, v in trainer.metrics.items():
        print(f"{k}: {v}")


def train_validate_yolo(data_yaml_path, epochs=100, imgsz=640):
    # Load the data configuration
    with open(data_yaml_path, 'r') as file:
        data_config = yaml.safe_load(file)
        print(data_config)

    # Load a model
    model = YOLO('yolov8n.pt')  # load a pretrained model

    # Train the model
    results = model.train(
        data=data_yaml_path,
        epochs=epochs,
        imgsz=imgsz,
        patience=50,  # early stopping patience
        save=True,  # save best model
        device='mps',  # use GPU if available
        verbose=True
    )
    print(results)
    # Validate the model
    val_results = model.val()

    print("Training completed. Best model saved.")
    print(f"Validation results: {val_results}")

    return model


if __name__ == "__main__":
    data_yaml_path = 'data/yolov8_dataset/data.yaml'
    trained_model = train_validate_yolo(data_yaml_path)
