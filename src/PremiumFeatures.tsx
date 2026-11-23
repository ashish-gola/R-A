import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react'
import { engagementPhotos, preWeddingPhotos, weddingData } from './weddingData'

export function ScratchReveal({ onContinue }: { onContinue: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const drawing = useRef(false)
  const [revealed, setRevealed] = useState(false)

  const reveal = () => {
    if (revealed) return
    setRevealed(true)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const card = cardRef.current
    if (!canvas || !card) return

    const paintCanvas = () => {
    const size = card.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(size.width * dpr)
    canvas.height = Math.round(size.height * dpr)
    canvas.style.width = `${size.width}px`
    canvas.style.height = `${size.height}px`
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    ctx.scale(dpr, dpr)
    const gold = ctx.createLinearGradient(0, 0, size.width, size.height)
    gold.addColorStop(0, '#a27c32')
    gold.addColorStop(.28, '#ead58a')
    gold.addColorStop(.52, '#c29a45')
    gold.addColorStop(.76, '#f2dda0')
    gold.addColorStop(1, '#96702e')
    ctx.fillStyle = gold
    ctx.fillRect(0, 0, size.width, size.height)
    ctx.globalAlpha = .18
    ctx.fillStyle = '#fff5c7'
    for (let i = 0; i < 180; i++) {
      ctx.beginPath()
      ctx.arc((i * 47) % size.width, (i * 83) % size.height, (i % 3) + 1, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
    }

    paintCanvas()
    window.addEventListener('resize', paintCanvas)
    return () => window.removeEventListener('resize', paintCanvas)
  }, [])

  const scratch = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealed) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 24, 0, Math.PI * 2)
    ctx.fill()

    if (Math.random() < .65) {
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let cleared = 0
      for (let i = 3; i < pixels.length; i += 32) if (pixels[i] === 0) cleared++
      const estimated = cleared / (pixels.length / 32)
      if (estimated > .55) {
        if (canvas) canvas.style.opacity = '0'
        reveal()
      }
    }
  }

  const addToCalendar = () => {
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',`DTSTART:${weddingData.date.iso.replace(/[-:]/g,'').split('.')[0]}Z`,`SUMMARY:Rupak Gola and Anshika Prajapati Wedding`,`DESCRIPTION:Wedding celebration of Rupak Gola and Anshika Prajapati`,`END:VEVENT`,`END:VCALENDAR`].join('\r\n')
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'rupak-anshika-wedding.ics'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="scratch-section" id="date">
      <div className="scratch-mandala" />
      <div className="scratch-particles">{Array.from({length:18},(_,i)=><i key={i}/>)}</div>
      <motion.div className="scratch-heading" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
        <p>Our Most Cherished Moment</p>
        <h2>Something Special Is<br/><em>Waiting For You!</em></h2>
        <span>Scratch the card to reveal our special day.</span>
      </motion.div>
      <motion.div ref={cardRef} className={`scratch-card ${revealed?'revealed':''}`} initial={{opacity:0,scale:.94}} whileInView={{opacity:1,scale:1}} viewport={{once:true}}>
        <div className="scratch-reveal">
          <p>Save The Date</p>
          <strong>{weddingData.date.display}</strong>
          <h3>{weddingData.couple.groom} <b>♥</b> {weddingData.couple.bride}</h3>
          <span>Two Hearts. One Journey. Forever Together.</span>
          <div className="scratch-actions"><button onClick={addToCalendar}><CalendarDays/> Add to Calendar</button><button onClick={onContinue}>Continue Exploring <ChevronRight/></button></div>
        </div>
        {!revealed && <canvas ref={canvasRef} className="scratch-canvas" aria-label="Scratch card to reveal the wedding date"
          onPointerDown={(e)=>{e.preventDefault();drawing.current=true;document.body.style.overflow='hidden';e.currentTarget.setPointerCapture(e.pointerId)}}
          onPointerUp={()=>{drawing.current=false;document.body.style.overflow=''}}
          onPointerCancel={()=>{drawing.current=false;document.body.style.overflow=''}}
          onPointerLeave={()=>{drawing.current=false;document.body.style.overflow=''}}
          onPointerMove={scratch}/>} 
        {revealed && <div className="confetti" aria-hidden="true">{Array.from({length:34},(_,i)=><i key={i}/>)}</div>}
      </motion.div>
      {!revealed && <button className="reveal-alternative" onClick={reveal}>Reveal Date</button>}
      {!revealed && <p className="swipe-note">Swipe to Reveal</p>}
    </section>
  )
}

export function JourneyGallery() {
  const [active,setActive] = useState(0)
  const [rotation,setRotation] = useState(0)
  const [paused,setPaused] = useState(false)
  const [lightbox,setLightbox] = useState<number|null>(null)
  const touchStart = useRef<number|null>(null)
  const resumeTimer = useRef<number|null>(null)
  const dragFrame = useRef<number|null>(null)
  const suppressClick = useRef(false)
  const rotationRef = useRef(0)
  const drag = useRef({
    active:false,
    startX:0,
    baseRotation:0,
    lastX:0,
    lastTime:0,
    velocity:0,
    moved:false,
  })
  const photos = galleryPhotos.slice(0, 12)
  const count = photos.length

  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  useEffect(() => {
    if (paused || lightbox !== null || drag.current.active) return
    let frame = 0
    let last = performance.now()
    const animate = (now:number) => {
      const delta = Math.min(now - last, 32)
      last = now
      setRotation(value => {
        const next = value - delta * .006
        rotationRef.current = next
        return next
      })
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [paused, lightbox, drag.current.active])

  const pauseAndResume = (pause=true) => {
    setPaused(pause)
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
    if (pause) resumeTimer.current = window.setTimeout(() => setPaused(false), 3000)
  }

  const selectPhoto = (index:number) => {
    pauseAndResume(true)
    if (index === active) {
      setLightbox(index)
      return
    }
    setActive(index)
    const step = 360 / count
    setRotation(-index * step)
  }

  const navigate = (direction:number) => {
    const next = (active + direction + count) % count
    selectPhoto(next)
  }

  const onTouchStart = (clientX:number) => {
    if (dragFrame.current) cancelAnimationFrame(dragFrame.current)
    touchStart.current = clientX
    drag.current = {
      active:true,
      startX:clientX,
      baseRotation:rotationRef.current,
      lastX:clientX,
      lastTime:performance.now(),
      velocity:0,
      moved:false,
    }
    pauseAndResume(true)
  }

  const onTouchMove = (clientX:number) => {
    if (!drag.current.active) return
    const now = performance.now()
    const delta = clientX - drag.current.startX
    const velocityDelta = clientX - drag.current.lastX
    const elapsed = Math.max(now - drag.current.lastTime, 1)
    drag.current.velocity = velocityDelta / elapsed
    drag.current.lastX = clientX
    drag.current.lastTime = now
    if (Math.abs(delta) > 5) {
      drag.current.moved = true
      suppressClick.current = true
    }
    const next = drag.current.baseRotation + delta * .32
    rotationRef.current = next
    setRotation(next)
  }

  const onTouchEnd = () => {
    if (!drag.current.active) return
    const moved = drag.current.moved
    drag.current.active = false
    touchStart.current = null

    let velocity = drag.current.velocity
    let current = rotationRef.current
    const step = 360 / count

    const inertia = () => {
      velocity *= .94
      current += velocity * 18
      rotationRef.current = current
      setRotation(current)
      if (Math.abs(velocity) > .035) {
        dragFrame.current = requestAnimationFrame(inertia)
      } else {
        const nearestIndex = Math.round(-current / step)
        const normalizedIndex = (nearestIndex % count + count) % count
        const target = -normalizedIndex * step
        let difference = ((target - current + 540) % 360) - 180
        const snap = () => {
          difference *= .82
          const next = target - difference
          rotationRef.current = next
          setRotation(next)
          if (Math.abs(difference) > .18) {
            dragFrame.current = requestAnimationFrame(snap)
          } else {
            setRotation(target)
            setActive(normalizedIndex)
            pauseAndResume(true)
          }
        }
        snap()
      }
    }

    if (moved) inertia()
    else drag.current.active = false
  }

  return <section className="journey section orbit-section" id="story">
    <div className="orbit-pattern" />
    <div className="orbit-heading">
      <p>Our Beautiful Journey</p>
      <h2>Rupak Gola <span>♥</span> Anshika Prajapati</h2>
      <strong>Every moment, a memory. Every memory, a story.</strong>
    </div>

    <div className="orbit-stage"
      onPointerDown={(e)=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);onTouchStart(e.clientX)}}
      onPointerMove={(e)=>{if(drag.current.active)e.preventDefault();onTouchMove(e.clientX)}}
      onPointerUp={()=>onTouchEnd()}
      onPointerCancel={()=>onTouchEnd()}>
      <div className="orbit-center"><span>Our Beautiful</span><em>Journey</em></div>
      <div className="orbit-ring">
        {photos.map((photo,index) => {
          const step = 360 / count
          const angle = (index * step + rotation) * Math.PI / 180
          const depth = (Math.cos(angle)+1)/2
          const normalized = Math.sin(angle)
          const scale = .68 + depth * .32
          const x = normalized * (typeof window !== 'undefined' && window.innerWidth < 700 ? 38 : 42)
          const z = (Math.cos(angle) - 1) * 240
          const zIndex = Math.round(depth * 100)
          const opacity = .48 + depth * .52
          return <motion.button
            key={photo.src}
            className={`orbit-card ${index===active?'active':''}`}
            style={{
              transform:`translate3d(${x}vw, ${-Math.abs(normalized)*18}px, ${z}px) scale(${scale}) rotateY(${-normalized*18}deg)`,
              zIndex,
              opacity,
            }}
            onClick={(e)=>{e.stopPropagation();if(suppressClick.current){suppressClick.current=false;return}selectPhoto(index)}}
            aria-label={`${index===active?'Open':'Bring to front'} ${photo.caption}`}>
            <img src={photo.src} alt={photo.caption} loading={index<3?'eager':'lazy'} />
            <div><small>{photo.category}</small><strong>{photo.caption}</strong></div>
          </motion.button>
        })}
      </div>
    </div>

    <div className="orbit-controls">
      <button onClick={()=>navigate(-1)} aria-label="Previous photograph"><ChevronLeft/></button>
      <button className="orbit-play" onClick={()=>pauseAndResume(!paused)} aria-label={paused?'Resume rotation':'Pause rotation'}>{paused?<Play/>:<Pause/>}</button>
      <button onClick={()=>navigate(1)} aria-label="Next photograph"><ChevronRight/></button>
    </div>

    <AnimatePresence>{lightbox!==null&&<motion.div className="gallery-lightbox" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setLightbox(null)}>
      <button className="lightbox-close" aria-label="Close gallery" onClick={()=>setLightbox(null)}><X/></button>
      <button className="lightbox-prev" aria-label="Previous photograph" onClick={(e)=>{e.stopPropagation();navigate(-1)}}><ChevronLeft/></button>
      <motion.img key={photos[lightbox].src} src={photos[lightbox].src} alt={photos[lightbox].caption} initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} onClick={(e)=>e.stopPropagation()} />
      <div className="lightbox-caption" onClick={(e)=>e.stopPropagation()}><small>{photos[lightbox].category}</small><strong>{photos[lightbox].caption}</strong></div>
      <button className="lightbox-next" aria-label="Next photograph" onClick={(e)=>{e.stopPropagation();navigate(1)}}><ChevronRight/></button>
    </motion.div>}</AnimatePresence>
  </section>
}
