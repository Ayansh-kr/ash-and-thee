import { useState, useRef, useEffect } from 'react'
import './App.css'

const chapters = [
  {
    image: "/images/chapter1.gif",
    audio: "/audio/audio1.mp3"
  },
  {
    image: "/images/chapter2.gif",
    audio: "/audio/audio2.mp3"
  },
  {
    image: "/images/chapter3.gif",
    audio: "/audio/audio3.mp3"
  },
  {
    image: "/images/chapter4.gif",
    audio: "/audio/audio4.mp3"
  },
  {
    image: "/images/chapter5.gif",
    audio: "/audio/audio5.mp3"
  }
]

function OpeningScreen({ onOpen }) {
  return (
    <div className="opening-screen">
      <div className="opening-content">
        <h1 className="opening-title">Heyyy my Thee ♡</h1>
        <div className="opening-text">
          <p>I tried making this grand...</p>
          <p>but with my current skills, I couldn't quite pull that off 😭</p>
          <p>So I made this little thing instead.</p>
          <p>Maybe it's simple...</p>
          <p>and maybe it's not perfectly handmade...</p>
          <p>but I just wanted to make something for you.</p>
        </div>
        <button className="open-button" onClick={onOpen}>
          Open the story →
        </button>
      </div>
    </div>
  )
}

function MusicControl({ isMuted, onToggle }) {
  return (
    <button 
      className={`music-control ${isMuted ? 'muted' : ''}`}
      onClick={onToggle}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? '🔇' : '🔊'}
    </button>
  )
}

function PageTurnButton({ onClick }) {
  return (
    <button className="page-turn-button" onClick={onClick} aria-label="Next page">
      →
    </button>
  )
}

function BackButton({ onClick }) {
  return (
    <button className="back-button" onClick={onClick} aria-label="Back">
      ←
    </button>
  )
}

function ChapterPage({ chapter, isMuted, onMuteToggle, onNext, onBack, isLastChapter }) {
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true
      if (!isMuted) {
        audioRef.current.play().catch(err => console.log('Audio play error:', err))
      }
    }
  }, [chapter, isMuted])

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(err => console.log('Audio play error:', err))
      }
    }
  }, [isMuted])

  return (
    <div className="chapter-page">
      <img src={chapter.image} alt="Chapter artwork" className="artwork" />
      <audio ref={audioRef} src={chapter.audio} />
      <MusicControl isMuted={isMuted} onToggle={onMuteToggle} />
      <BackButton onClick={onBack} />
      {!isLastChapter && <PageTurnButton onClick={onNext} />}
    </div>
  )
}

function App() {
  const [currentStage, setCurrentStage] = useState('opening')
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [audioFading, setAudioFading] = useState(false)

  const handleOpenStory = () => {
    setCurrentStage('chapter')
    setCurrentChapterIndex(0)
  }

  const handleNextChapter = () => {
    if (isTransitioning) return
    
    const nextIndex = currentChapterIndex + 1
    if (nextIndex >= chapters.length) return
    
    setIsTransitioning(true)
    setAudioFading(true)
    
    setTimeout(() => {
      setCurrentChapterIndex(nextIndex)
      
      setTimeout(() => {
        setAudioFading(false)
        setIsTransitioning(false)
      }, 300)
    }, 400)
  }

  const handleBack = () => {
    if (isTransitioning) return
    
    if (currentChapterIndex === 0) {
      // Go back to opening screen
      setIsTransitioning(true)
      setAudioFading(true)
      
      setTimeout(() => {
        setCurrentStage('opening')
        setCurrentChapterIndex(0)
        
        setTimeout(() => {
          setAudioFading(false)
          setIsTransitioning(false)
        }, 300)
      }, 400)
    } else {
      // Go to previous chapter
      const prevIndex = currentChapterIndex - 1
      setIsTransitioning(true)
      setAudioFading(true)
      
      setTimeout(() => {
        setCurrentChapterIndex(prevIndex)
        
        setTimeout(() => {
          setAudioFading(false)
          setIsTransitioning(false)
        }, 300)
      }, 400)
    }
  }

  const handleMuteToggle = (e) => {
    e.stopPropagation()
    setIsMuted(!isMuted)
  }

  const currentChapter = chapters[currentChapterIndex]
  const isLastChapter = currentChapterIndex === chapters.length - 1

  return (
    <div className="app">
      {currentStage === 'opening' && (
        <OpeningScreen onOpen={handleOpenStory} />
      )}
      
      {currentStage === 'chapter' && currentChapter && (
        <div className={`storybook ${isTransitioning ? 'transitioning' : ''}`}>
          <ChapterPage 
            chapter={currentChapter}
            isMuted={isMuted || audioFading}
            onMuteToggle={handleMuteToggle}
            onNext={handleNextChapter}
            onBack={handleBack}
            isLastChapter={isLastChapter}
          />
        </div>
      )}
    </div>
  )
}

export default App
