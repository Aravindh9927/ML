import numpy as np
from sklearn.ensemble import RandomForestClassifier
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import onnx
from onnx_coreml import convert


# Train a RandomForestClassifier model
clf = RandomForestClassifier()
X = np.array([[0, 0], [1, 1], [1, 0], [0, 1]])
y = [0, 1, 1, 0]
clf.fit(X, y)

# Convert the trained model to ONNX format
# Adjust the input shape as per your dataset
initial_type = [('input', FloatTensorType([None, 2]))]
onnx_model = convert_sklearn(clf, initial_types=initial_type)

# Save the ONNX model to a file
with open("rf_model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())

print("Model successfully converted to ONNX.")

# Load the ONNX model
onnx_model = onnx.load("rf_model.onnx")

# Convert the ONNX model to CoreML
coreml_model = convert(onnx_model)

# Save the CoreML model
coreml_model.save("rf_model.mlmodel")

print("ONNX model successfully converted to CoreML.")
