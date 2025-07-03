// Diễn viên
import './App.css'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import * as mobilenetModule from '@tensorflow-models/mobilenet'
import * as knnClassifier from '@tensorflow-models/knn-classifier'
import { useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import soundURL from './assets/hey_touch.mp3'

var sound = new Howl({ src: [soundURL] })
const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

const NOT_TOUCH_LABEL = 'not_touch'
const TOUCHED_LABEL = 'touched'
const TRAINING_TIMES = 50
const TOUCHED_CONFIDENCE = 0.8 

function App() {
  const video = useRef(null)
  const classifier = useRef(null)
  const mobilenet = useRef(null)
  const canPlaySound = useRef(true)

  const [step, setStep] = useState(1)
  const [progess, setProgress] = useState(0)
  const [touched, setTouched] = useState(false)
  const [isTraining, setIsTraining] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Thiết lập camera
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true})
      if(video.current) {
        video.current.srcObject = stream
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Khởi tạo ứng dụng
  const init = async () => { 
    setIsInitializing(true)
    try {
      await tf.setBackend('webgl')
      await setupCamera()

      mobilenet.current = await mobilenetModule.load()
      classifier.current = knnClassifier.create()

      setIsInitializing(false)
    } catch (error) {
      console.error(error)
    }
  }

  // Huấn luyện mô hình
  const addTrainingExample = async (label) => {
    const embedding = mobilenet.current.infer(video.current, true)
    classifier.current.addExample(embedding, label)
    await sleep(100)
  }

  // Huấn luyện với các mẫu
  const trainWithSamples = async (label) => {
    try {
      setIsTraining(true)

      for(let i = 0; i < TRAINING_TIMES; i++) {
        await addTrainingExample(label)
        const precent = Math.floor(((i + 1) / TRAINING_TIMES) * 100)
        setProgress(precent)
      }

      setIsTraining(false)
      setProgress(0)

      setStep(label === NOT_TOUCH_LABEL ? 2 : 3)

    } catch (error) {
      console.error(error)
      setIsTraining(false)
    }
  }

  // Dự đoán
  const run = async () => {
    const embedding = mobilenet.current.infer(video.current,true)
    const result = await classifier.current.predictClass(embedding)

    if(result.label === TOUCHED_LABEL && result.confidences[result.label] > TOUCHED_CONFIDENCE) {
      if(canPlaySound.current) {
        canPlaySound.current = false
        sound.play()
      }
      setTouched(true)
    } else {
      setTouched(false)
    }
    await sleep(150) 
    run() 
  }
  
  useEffect(() => {
    init()
    sound.on('end', function(){
      canPlaySound.current = true; // Phát lại âm thanh
    });
    return () => {
      console.log('Cleaning up...')
    }
  }, [])

  // Thay đổi nội dung tiêu đề khi có sự kiện
  const getTitle = () => {
    if (step === 1) {
      return isInitializing ? 'Đang khởi tạo ứng dụng vui lòng chờ một chút...' : isTraining ? `Không chạm tay cho tới khi hoàn thành. Máy đang học ${progess}%` : 'Bước 1: Quay video không chạm tay lên mặt';
    } else if (step === 2) {
      return isTraining ? `Giữ tay trong tầm nhìn camera cho tới khi hoàn thành. Máy đang học ${progess}%` : 'Bước 2: Quay video đưa tay lên gần mặt (10cm)';
    } else if (step === 3) {
      return isTraining ? 'AI đang theo dõi tay của bạn...' : 'Bước 3: Bấm Run để nhận diện';
    }
    return '';
  }

  return (
    <>
      <div className={`main ${touched ? 'touched' : ''}`}>
        <video ref={video} className='video' autoPlay ></video>
      </div>

      <h1 className='title'>{getTitle()}</h1>
      
      <div className='control'>
        {step === 1 && <button className='btn' onClick={() => { trainWithSamples(NOT_TOUCH_LABEL); setStep(1) }} disabled = {isTraining || isInitializing}>Bắt đầu</button>}
        {step === 2 && <button className='btn' onClick={() => { trainWithSamples(TOUCHED_LABEL); setStep(2) }} disabled = {isTraining}>Tiếp tục</button>}
        {step === 3 && <button className='btn' onClick={run}>Khởi động</button>}
      </div>
    </>
  )
}

export default App
