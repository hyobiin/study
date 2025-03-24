import { useRef, useState } from 'react';
import './CustomVideoPlayer.css';
import './App.css';

function CustomVideoPlayer(){
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef(null);

  const handleLoadedMetadata= () => {
    if(!videoRef.current) return; // 방어로직 쓰는 이유: 비디오가 연결이 안 되었을 경우가 있어서
    setDuration(videoRef.current.duration);
  }

  const handleTimeUpdate = () => {
    if(!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}`
  }

  const handleVolumChange = (e) => {
    const volume = parseFloat(e.target.value);
    setVolume(volume);
    if(videoRef.current){
      videoRef.current.volume = volume;
    }
  }

  const togglePlayPause = () => {
    if(!videoRef.current) return;
    if(videoRef.current.paused || videoRef.current.ended){
      videoRef.current.play();
      setIsPlaying(true);
    }else{
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }

  const handleRewind = () => {
    if(videoRef.current){
      videoRef.current.currentTime -= 3;
    }
  }

  const handleForward = () => {
    if(videoRef.current){
      videoRef.current.currentTime += 3;

      if(videoRef.current.currentTime >= videoRef.current.duration){
        setIsPlaying(false);
      }
    }
  }

  const handleSpeedChange = (e) => {
    const speed = parseFloat(e.target.value);
    setPlaybackRate(speed);
    if(videoRef.current){
      videoRef.current.playbackRate = speed;
    }
  }

  const handleFullScreen = () => {
    if(!videoRef.current) return;

    if(videoRef.current.requestFullscreen()){
      videoRef.current.requestFullscreen();
    }else if(videoRef.current.mozRequestFullsreen){ // firefox
      videoRef.current.mozRequestFullsreen();
    }else if(videoRef.current.webkitRequestFullsreen){ // chrome, safari, opera
      videoRef.current.webkitRequestFullsreen();
    }else if(videoRef.current.msRequestFullsreen){ // ie, edge
      videoRef.current.msRequestFullsreen();
    }
  }

  const handleProgressClick = (e) => {
  if (!videoRef.current) return;

    const video = videoRef.current; // 비디오 요소 가져오기
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * video.duration; // ✅ 수정된 계산식

    video.currentTime = newTime; // ✅ 비디오 현재 재생 위치 변경
  };

  return(
    <div>
      <h1>🎥 커스텀 비디오 플레이어</h1> <br />
      <div className="video-container">
        <video 
          src="https://www.w3schools.com/html/mov_bbb.mp4" 
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        ></video>

        <div className="progress" onClick={handleProgressClick}>
          <div 
            className="progress-filled"
            style={{
              width: duration ? `${(currentTime / duration) * 100}%` : `0`
            }}
          ></div>
        </div>

        <div className="controls">
          <button onClick={handleRewind}>⏪ 3초</button>
          <button onClick={togglePlayPause}>
            { isPlaying ? '⏸ 일시정지' : '▶ 재생'}
          </button>
          <button onClick={handleForward}>⏩ 3초</button>
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumChange}
          />
          <select value={playbackRate} onChange={handleSpeedChange}>
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
          <button onClick={handleFullScreen}>⛶ 전체화면</button>
        </div>
      </div>
    </div>
  )
};

export default CustomVideoPlayer;