"""
dataset_builder.py

Creates a cropped RBC dataset from the Chula-RBC-12 dataset.

Input:
    Chula-RBC-12-Dataset-1.0/
        Dataset/
        Label/

Output:
    processed_dataset/
        Normal/
        Macrocyte/
        ...
"""

from pathlib import Path
import cv2
import os
import numpy as np
from tqdm import tqdm


# ----------------------------------------------------------
# Configuration
# ----------------------------------------------------------

CROP_SIZE = 224

CLASS_NAMES = {
    0: "Normal",
    1: "Macrocyte",
    2: "Microcyte",
    3: "Spherocyte",
    4: "Target_Cell",
    5: "Stomatocyte",
    6: "Ovalocyte",
    7: "Teardrop",
    8: "Burr_Cell",
    9: "Schistocyte",
    10: "Uncategorized",
    11: "Hypochromia"
}


class RBCDatasetBuilder:

    def __init__(self,
                 dataset_root,
                 output_folder="processed_dataset",
                 crop_size=224):

        self.dataset_root = Path(dataset_root)

        self.image_folder = self.dataset_root / "Dataset"

        self.label_folder = self.dataset_root / "Label"

        self.output_folder = Path(output_folder)

        self.crop_size = crop_size

        self.create_output_folders()


    def create_output_folders(self):

        self.output_folder.mkdir(exist_ok=True)

        for cls in CLASS_NAMES.values():

            (self.output_folder / cls).mkdir(
                parents=True,
                exist_ok=True
            )
            