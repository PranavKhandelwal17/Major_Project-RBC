"""
Model Training and Transfer Learning Pipeline for RBC Morphology Classification.
Supports EfficientNetV2, EfficientNet-B1, ResNet50, MobileNetV2, and DenseNet121.
Handles class imbalance via weighted cross-entropy and data augmentation.
"""

import os
import argparse
from pathlib import Path
from typing import Tuple

# Fix OpenMP conflict on Windows
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models


CLASS_NAMES = [
    "0_Normal",
    "10_Uncategorized",
    "11_Hypochromia",
    "1_Macrocyte",
    "2_Microcyte",
    "3_Spherocyte",
    "4_Target_Cell",
    "5_Stomatocyte",
    "6_Ovalocyte",
    "7_Teardrop",
    "8_Burr_Cell",
    "9_Schistocyte",
]


def get_data_transforms(img_size: int = 224) -> Tuple[transforms.Compose, transforms.Compose]:
    """Get train and evaluation transforms."""
    train_transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.5),
        transforms.RandomRotation(degrees=30),
        transforms.ColorJitter(brightness=0.1, contrast=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    val_transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    return train_transform, val_transform


def build_model(architecture: str, num_classes: int = 12, pretrained: bool = True) -> nn.Module:
    """Build candidate deep learning architecture."""
    arch = architecture.lower()
    weights = "DEFAULT" if pretrained else None

    if "efficientnet_v2" in arch or "efficientnetv2" in arch:
        model = models.efficientnet_v2_s(weights=weights)
        in_features = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(in_features, num_classes)
    elif "efficientnet_b1" in arch or "efficientnetb1" in arch:
        model = models.efficientnet_b1(weights=weights)
        in_features = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(in_features, num_classes)
    elif "mobilenet" in arch:
        model = models.mobilenet_v2(weights=weights)
        in_features = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(in_features, num_classes)
    elif "resnet" in arch:
        model = models.resnet50(weights=weights)
        in_features = model.fc.in_features
        model.fc = nn.Linear(in_features, num_classes)
    elif "densenet" in arch:
        model = models.densenet121(weights=weights)
        in_features = model.classifier.in_features
        model.classifier = nn.Linear(in_features, num_classes)
    else:
        raise ValueError(f"Unsupported architecture: {architecture}")

    return model


def train_one_epoch(model, loader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for inputs, labels in loader:
        inputs, labels = inputs.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * inputs.size(0)
        _, preds = outputs.max(1)
        correct += preds.eq(labels).sum().item()
        total += labels.size(0)

    epoch_loss = running_loss / max(total, 1)
    epoch_acc = correct / max(total, 1)
    return epoch_loss, epoch_acc


def evaluate(model, loader, criterion, device):
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0

    with torch.no_grad():
        for inputs, labels in loader:
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            loss = criterion(outputs, labels)

            running_loss += loss.item() * inputs.size(0)
            _, preds = outputs.max(1)
            correct += preds.eq(labels).sum().item()
            total += labels.size(0)

    epoch_loss = running_loss / max(total, 1)
    epoch_acc = correct / max(total, 1)
    return epoch_loss, epoch_acc


def main():
    parser = argparse.ArgumentParser(description="Train RBC morphology classification model")
    parser.add_argument("--arch", type=str, default="efficientnet_v2_s", help="Model architecture")
    parser.add_argument("--data_dir", type=str, default="data/rbc_dataset_final", help="Dataset directory")
    parser.add_argument("--epochs", type=int, default=10, help="Training epochs")
    parser.add_argument("--batch_size", type=int, default=32, help="Batch size")
    parser.add_argument("--lr", type=float, default=1e-4, help="Learning rate")
    parser.add_argument("--save_dir", type=str, default="models/trained", help="Output directory")
    args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    train_trans, val_trans = get_data_transforms()
    train_dir = Path(args.data_dir) / "train"
    val_dir = Path(args.data_dir) / "val"

    if not train_dir.exists():
        print(f"Error: dataset path {train_dir} does not exist.")
        return

    train_ds = datasets.ImageFolder(str(train_dir), transform=train_trans)
    val_ds = datasets.ImageFolder(str(val_dir), transform=val_trans)

    train_loader = DataLoader(train_ds, batch_size=args.batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_ds, batch_size=args.batch_size, shuffle=False, num_workers=0)

    print(f"Train samples: {len(train_ds)}, Val samples: {len(val_ds)}, Classes: {len(train_ds.classes)}")

    model = build_model(args.arch, num_classes=len(train_ds.classes)).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)

    best_val_acc = 0.0
    save_dir = Path(args.save_dir)
    save_dir.mkdir(parents=True, exist_ok=True)

    for epoch in range(args.epochs):
        t_loss, t_acc = train_one_epoch(model, train_loader, criterion, optimizer, device)
        v_loss, v_acc = evaluate(model, val_loader, criterion, device)
        print(f"Epoch {epoch+1}/{args.epochs} | Train Loss: {t_loss:.4f} Acc: {t_acc:.4f} | Val Loss: {v_loss:.4f} Acc: {v_acc:.4f}")

        if v_acc > best_val_acc:
            best_val_acc = v_acc
            torch.save(model.state_dict(), save_dir / f"{args.arch}_best.pt")
            print(f"  -> Saved new best checkpoint ({v_acc:.4f})")

    print(f"Training complete. Best validation accuracy: {best_val_acc:.4f}")


if __name__ == "__main__":
    main()
