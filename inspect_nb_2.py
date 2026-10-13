import json

with open("7th_sem_mini_project.ipynb", "r", encoding="utf-8") as f:
    nb = json.load(f)

for i in range(88, len(nb.get("cells", []))):
    cell = nb["cells"][i]
    if cell.get("cell_type") == "code":
        source = "".join(cell.get("source", []))
        for kw in ["EfficientNet", "ResNet", "DenseNet", "model.fit", "classification_report", "test_acc", "accuracy"]:
            if kw.lower() in source.lower():
                lines = [line for line in source.split("\n") if line.strip() and not line.strip().startswith("#")]
                first_lines = "\n".join(lines[:6])
                print(f"Cell {i} ({kw}):")
                print(first_lines.encode('ascii', errors='replace').decode('ascii'))
                print("---")
                break
