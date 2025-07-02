// Diễn viên
import './App.css'
import * as mobileNet from '@tensorflow-models/mobilenet'
import * as knnClassifier from '@tensorflow-models/knn-classifier'
import { Howl } from 'howler'
import soundURL from './assets/hey_touch.mp3'
import { useEffect, useRef } from 'react'

// var sound = new Howl({
//   src: [soundURL]
// })
// sound.play()

function App() {

  // Tham chiếu đến video
  const video = useRef()

  // Thiết lập camera
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true})
      if(video.current) {
        video.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  // Hàm khởi tạo ứng dụng
  const init = async () => { 
    console.log('init...')
    await setupCamera()
  }
  
  useEffect(() => {
    init()
    return () => {
      console.log('App cleanup')
    }
  }, [])

  return (
    <>
      <div className="main">
        <video ref={video} className='video' autoPlay ></video>
      </div>

      <div className='control'>
        <button className='btn'>Train 1</button>
        <button className='btn'>Train 2</button>
        <button className='btn'>Run</button>
      </div>
    </>
  )
}

export default App
