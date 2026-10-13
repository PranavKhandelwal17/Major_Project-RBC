import json

with open("7th_sem_mini_project.ipynb", "r", encoding="utf-8") as f:
    nb = json.load(f)

print(f"Total cells: {len(nb.get('cells', []))}")
for i, cell in enumerate(nb.get("cells", [])):
    if cell.get("cell_type") == "code":
        source = "".join(cell.get("source", []))
        for kw in ["MobileNet", "EfficientNet", "ResNet", "DenseNet", "model.fit", "classification_report", "confusion_matrix"]:
            if kw.lower() in source.lower():
                print(f"--- Cell {i} (contains {kw}) ---")
                lines = [line for line in source.split("\n") if line.strip() and not line.strip().startswith("#")]
                print("\n".join(lines[:15]))
                print("...")
                break
