import pickle
import os

PICKLE_PATH = "ai_training/wlasl_data.pickle"

if os.path.exists(PICKLE_PATH):
    try:
        with open(PICKLE_PATH, "rb") as f:
            data_dict = pickle.load(f)
            data = data_dict.get('data', [])
            labels = data_dict.get('labels', [])
            print(f"Total samples: {len(data)}")
            print(f"Total labels: {len(labels)}")
            if len(data) > 0:
                print(f"First sample length: {len(data[0])}")
                print(f"First label: {labels[0]}")
                # Check for unique labels
                unique_labels = sorted(list(set(labels)))
                print(f"Unique labels (first 10): {unique_labels[:10]}")
                print(f"Total unique labels: {len(unique_labels)}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("File not found.")
