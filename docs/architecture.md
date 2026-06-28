# CareBridge AI Architecture

React Native (Expo) client communicates with the Node.js REST API.

Node.js backend persists data in MongoDB and delegates **all AI inference** to the FastAPI AI microservice.

The Python AI microservice performs:
- image feature extraction (OpenCV/Pillow)
- trend analysis from response history
- hybrid risk scoring and explainable recommendation

The AI training pipeline is isolated under `/ai-service/training` and can train on compatible wound datasets.
