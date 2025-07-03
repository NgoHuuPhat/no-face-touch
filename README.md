# 🤚 No Face Touch - AI Hand Detection App

AI application using TensorFlow.js and React to detect when you touch your face. Helps build the habit of not touching your face.

## 🎯 Features

- AI detection with TensorFlow.js and MobileNet
- Real-time webcam monitoring
- Audio alerts and visual feedback
- 3-step training process

## 🚀 Quick Start

```bash
git clone <repository-url>
cd no-face-touch
npm install
npm run dev
```

Open `http://localhost:5173`

**Requirements:** Node.js 16+, Webcam, WebGL-supported browser

## 🎮 How to Use

1. **Train "Not touching"**: Keep hands away from face, click "Start"
2. **Train "Touching"**: Bring hand near face, click "Continue" 
3. **Monitor**: Click "Start" to begin detection

## 🔧 Configuration

```javascript
const TRAINING_TIMES = 50          // Training samples
const TOUCHED_CONFIDENCE = 0.8     // Detection confidence
```

## ‍💻 Author

**Ngô Hữu Phát** - BE Developer

---

⭐ **Star this project if helpful!** ⭐
