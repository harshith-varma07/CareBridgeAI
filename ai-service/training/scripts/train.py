from pathlib import Path

import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split


def synthetic_dataset(samples: int = 400):
    """Generate a synthetic wound infection dataset for training.

    Features: [pain (0-10), fever (0/1), redness (0/1), discharge (0/1), redness_score (0-1)]
    Labels: 1 if infection likely (pain>=7, fever, discharge, or redness_score>0.7), else 0.
    """
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
    """Train a LogisticRegression model on synthetic data and save artifacts."""
    print("=" * 60)
    print("CareBridge AI — Model Training")
    print("=" * 60)

    x, y = synthetic_dataset()
    print(f"\nDataset: {x.shape[0]} samples, {x.shape[1]} features")
    print(f"Positive class: {y.sum()} ({y.mean():.1%}), Negative class: {(1 - y).sum()}")

    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, random_state=42
    )
    print(f"Train: {x_train.shape[0]} samples, Test: {x_test.shape[0]} samples")

    model = LogisticRegression(max_iter=500, random_state=42)
    model.fit(x_train, y_train)
    y_pred = model.predict(x_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)

    print(f"\n{'Metric':<15} {'Value':>10}")
    print("-" * 27)
    print(f"{'Accuracy':<15} {accuracy:>10.4f}")
    print(f"{'Precision':<15} {precision:>10.4f}")
    print(f"{'Recall':<15} {recall:>10.4f}")
    print(f"{'F1 Score':<15} {f1:>10.4f}")
    print(f"\nConfusion Matrix:\n{cm}")

    # Save model artifacts
    models_dir = Path(__file__).resolve().parents[1] / "models"
    models_dir.mkdir(parents=True, exist_ok=True)

    # Save coefficients as .npy for lightweight inference
    np.save(models_dir / "coef.npy", model.coef_)
    np.save(models_dir / "intercept.npy", model.intercept_)
    print(f"\nSaved coef.npy and intercept.npy to {models_dir}")

    # Save complete model with joblib for future use
    joblib_path = models_dir / "model.joblib"
    joblib.dump(model, joblib_path)
    print(f"Saved complete model to {joblib_path}")

    print(f"\nModel coefficients: {model.coef_}")
    print(f"Model intercept: {model.intercept_}")
    print("\n" + "=" * 60)
    print("Training complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
