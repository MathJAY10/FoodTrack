import torch
from torchvision import models, transforms
from PIL import Image
import requests
from io import BytesIO
import sys
import json

# ======================================================
#  Food Recognition Model (Offline, pretrained ResNet50)
# ======================================================

# Load pretrained ResNet model
model = models.resnet50(weights="IMAGENET1K_V2")
model.eval()

# Image transformation pipeline
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])

# Load Food-101 class labels
LABELS_URL = "https://raw.githubusercontent.com/tensorflow/datasets/master/tensorflow_datasets/image_classification/food101_labels.txt"
labels = requests.get(LABELS_URL, timeout=10).text.strip().splitlines()

def predict_food(image_url):
    try:
        # Download the image
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content)).convert("RGB")

        # Preprocess
        x = transform(img).unsqueeze(0)

        # Predict
        with torch.no_grad():
            preds = model(x)
            probs = torch.nn.functional.softmax(preds, dim=1)[0]

        top3 = torch.topk(probs, 3)
        results = []
        for i in range(3):
            label = labels[top3.indices[i].item()]
            score = round(top3.values[i].item() * 100, 2)
            results.append({"label": label, "confidence": score})

        return results
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Image URL missing"}))
        sys.exit(1)

    image_url = sys.argv[1]
    result = predict_food(image_url)
    print(json.dumps(result))
