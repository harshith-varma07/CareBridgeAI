from pathlib import Path

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split


def synthetic_dataset(samples: int = 400):
    rng = np.random.default_rng(42)
    pain = rng.integers(0, 11, samples)
    fever = rng.integers(0, 2, samples)
    redness = rng.integers(0, 2, samples)
    discharge = rng.integers(0, 2, samples)
    redness_score = rng.random(samples)
    y = ((pain >= 7) | (fever == 1) | (discharge == 1) | (redness_score > 0.7)).astype(int)
    x = np.column_stack([pain, fever, redness, discharge, redness_score])
    return x, y


def main():
    x, y = synthetic_dataset()
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)
    model = LogisticRegression(max_iter=500)
    model.fit(x_train, y_train)
    y_pred = model.predict(x_test)

    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred),
        "recall": recall_score(y_test, y_pred),
        "f1": f1_score(y_test, y_pred),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
    }

    models_dir = Path(__file__).resolve().parents[1] / "models"
    models_dir.mkdir(parents=True, exist_ok=True)
    np.save(models_dir / "model_coefficients.npy", model.coef_)
    np.save(models_dir / "model_intercept.npy", model.intercept_)

    print(metrics)


if __name__ == "__main__":
    main()
