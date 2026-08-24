import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from 'react'

export interface VideoPlayerHandle {
  play: () => void
  pause: () => void
  reset: () => void
  toggleFullscreen: () => void
  getCurrentTime: () => number
  jumpTo: (seconds: number) => void
}

interface VideoPlayerProps {
  title?: string
  initialTime?: number
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  function VideoPlayer({ title = '未命名视频', initialTime = 0 }, ref) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(initialTime)
    const [volume, setVolume] = useState(80)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const duration = 120

    const startTimer = useCallback(() => {
      if (timerRef.current) return
      timerRef.current = setInterval(() => {
        setCurrentTime((t) => {
          if (t + 1 >= duration) {
            clearInterval(timerRef.current!)
            timerRef.current = null
            setIsPlaying(false)
            return duration
          }
          return t + 1
        })
      }, 1000)
    }, [duration])

    const stopTimer = useCallback(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          if (currentTime >= duration) setCurrentTime(0)
          setIsPlaying(true)
          startTimer()
        },
        pause: () => {
          setIsPlaying(false)
          stopTimer()
        },
        reset: () => {
          setIsPlaying(false)
          stopTimer()
          setCurrentTime(0)
        },
        toggleFullscreen: () => {
          setIsFullscreen((f) => !f)
        },
        getCurrentTime: () => currentTime,
        jumpTo: (seconds: number) => {
          setCurrentTime(Math.max(0, Math.min(duration, seconds)))
        },
      }),
      [currentTime, startTimer, stopTimer, duration]
    )

    const progress = (currentTime / duration) * 100
    const fmt = (s: number) =>
      `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

    return (
      <div
        style={{
          border: isFullscreen ? '3px solid #646cff' : '1px solid #333',
          borderRadius: '12px',
          padding: '1rem',
          background: isFullscreen
            ? 'linear-gradient(135deg, #0f172a, #1e1b4b)'
            : '#1a1a1a',
          transition: 'all 0.3s',
          position: 'relative',
        }}
      >
        <div
          style={{
            aspectRatio: '16 / 9',
            backgroundColor: '#000',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {isPlaying && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                boxShadow: '0 0 8px #ef4444',
                animation: 'pulse 1s infinite',
              }}
            />
          )}
          <div
            style={{
              fontSize: isFullscreen ? '6rem' : '3rem',
              marginBottom: '0.5rem',
            }}
          >
            {isPlaying ? '▶️' : '⏸️'}
          </div>
          <div style={{ color: '#fff', fontWeight: 'bold' }}>{title}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            {fmt(currentTime)} / {fmt(duration)}
          </div>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <div
            style={{
              height: '6px',
              backgroundColor: '#333',
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '0.25rem',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#646cff',
                transition: 'width 0.3s linear',
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <button
              onClick={() => {
                if (isPlaying) {
                  stopTimer()
                  setIsPlaying(false)
                } else {
                  setIsPlaying(true)
                  startTimer()
                }
              }}
            >
              {isPlaying ? '⏸ 暂停' : '▶ 播放'}
            </button>
            <button onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}>
              ⏪ -10s
            </button>
            <button onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}>
              ⏩ +10s
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔊 {volume}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ width: '80px', padding: 0 }}
            />
          </div>
        </div>

        <p className="info-text" style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem' }}>
          💡 子组件内部状态：isPlaying / currentTime / volume / isFullscreen
          <br />
          父组件通过 ref 只能调用 useImperativeHandle 暴露出来的方法。
        </p>
      </div>
    )
  }
)

export default VideoPlayer
