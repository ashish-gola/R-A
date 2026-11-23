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
          <h3>{weddingData.couple.groom} <b>â™¥</b> {weddingData.couple.bride}</h3>
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
  const [activeTab, setActiveTab] = useState<'pre' | 'engagement'>('pre')
  const [active, setActive] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [paused, setPaused] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const dragRef = useRef({ active:false, startX:0, base:0, moved:false })
  const rotationRef = useRef(0)
  const photos = activeTab === 'pre' ? preWeddingPhotos : engagementPhotos
  const count = photos.length

  useEffect(() => { rotationRef.current = rotation }, [rotation])

  useEffect(() => {
    if (paused || lightbox !== null || dragRef.current.active) return
    let frame = 0
    let previous = performance.now()
    const animate = (now:number) => {
      const delta = Math.min(now - previous, 32)
      previous = now
      setRotation(value => {
        const next = value - delta * .006
        rotationRef.current = next
        return next
      })
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [paused, lightbox, activeTab])

  const selectTab = (tab:'pre'|'engagement') => {
    if (tab === activeTab) return
    setLightbox(null)
    setActive(0)
    setRotation(0)
    rotationRef.current = 0
    setPaused(false)
    setActiveTab(tab)
  }

  const selectPhoto = (index:number) => {
    setActive(index)
    const step = 360 / count
    const target = -index * step
    setRotation(target)
    rotationRef.current = target
  }

  const navigate = (direction:number) => {
    selectPhoto((active + direction + count) % count)
  }

  const beginDrag = (clientX:number) => {
    dragRef.current = { active:true, startX:clientX, base:rotationRef.current, moved:false }
  }

  const moveDrag = (clientX:number) => {
    if (!dragRef.current.active) return
    const delta = clientX - dragRef.current.startX
    if (Math.abs(delta) > 5) dragRef.current.moved = true
    const next = dragRef.current.base + delta * .32
    rotationRef.current = next
    setRotation(next)
  }

  const endDrag = () => {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    if (!dragRef.current.moved) return
    const step = 360 / count
    const nearest = ((Math.round(-rotationRef.current / step) % count) + count) % count
    selectPhoto(nearest)
  }

  const heading = activeTab === 'pre'
    ? ['Our Pre-Wedding Memories', 'Pre-Wedding Memories', 'Romance, laughter, and every beautiful moment before forever.']
    : ['Our Engagement – A Beautiful Beginning', 'Engagement Memories', 'A promise made, a new chapter begun, and countless memories created.']

  return <section className={`journey section orbit-section ${activeTab==='engagement'?'engagement-active':''}`} id="story">
    <div className="orbit-pattern" />

    {activeTab === 'engagement' && <motion.div className="engagement-story"
      key="engagement-story"
      initial={{opacity:0,scale:.985}} animate={{opacity:1,scale:1}} transition={{duration:.7}}
      style={{backgroundImage:`linear-gradient(90deg,rgba(38,8,12,.82),rgba(38,8,12,.18)),url('${engagementPhotos[0].src}')`}}>
      <div><p>From Yes to Forever</p><h2>One beautiful moment,<br/><em>two happy hearts.</em></h2><span>And the beginning of a lifetime together.</span></div>
    </motion.div>}

    <div className="gallery-tabs" role="tablist" aria-label="Gallery category">
      <button role="tab" aria-selected={activeTab==='pre'} className={activeTab==='pre'?'active':''} onClick={()=>selectTab('pre')}>Pre-Wedding</button>
      <button role="tab" aria-selected={activeTab==='engagement'} className={activeTab==='engagement'?'active':''} onClick={()=>selectTab('engagement')}>Engagement</button>
    </div>

    <motion.div className="orbit-heading"
      key={activeTab}
      initial={{opacity:0,y:-8,scale:.985}}
      animate={{opacity:1,y:0,scale:1}}
      transition={{duration:.55}}>
      <p>{heading[1]}</p>
      <h2>{heading[0]}</h2>
      <strong>{heading[2]}</strong>
    </motion.div>

    <motion.div className="orbit-stage"
      key={activeTab}
      initial={{opacity:0,scale:.94}}
      animate={{opacity:1,scale:1}}
      transition={{duration:.65,easing:'easeOut'}}
      onPointerDown={(e)=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);beginDrag(e.clientX)}}
      onPointerMove={(e)=>moveDrag(e.clientX)}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}>
      <div className="orbit-center"><span>Our Beautiful</span><em>{activeTab==='pre'?'Journey':'Promise'}</em></div>
      <div className="orbit-ring">
        {photos.map((photo,index) => {
          const step = 360 / count
          const angle = (index * step + rotation) * Math.PI / 180
          const depth = (Math.cos(angle)+1)/2
          const normalized = Math.sin(angle)
          const scale = .68 + depth * .32
          const x = normalized * (typeof window !== 'undefined' && window.innerWidth < 700 ? 38 : 42)
          const z = (Math.cos(angle) - 1) * 240
          return <motion.button
            key={`${activeTab}-${photo.src}`}
            className={`orbit-card ${index===active?'active':''}`}
            style={{transform:`translate3d(${x}vw, ${-Math.abs(normalized)*18}px, ${z}px) scale(${scale}) rotateY(${-normalized*18}deg)`,zIndex:Math.round(depth*100),opacity:.48+depth*.52}}
            onClick={(e)=>{e.stopPropagation();if(index===active)setLightbox(index);else selectPhoto(index)}}
            aria-label={`${index===active?'Open':'Bring to front'} ${photo.caption}`}>
            <img src={photo.src} alt={photo.caption} loading={index<3?'eager':'lazy'} />
            <div><small>{photo.category}</small><strong>{photo.caption}</strong></div>
          </motion.button>
        })}
      </div>
    </motion.div>

    <div className="orbit-controls">
      <button onClick={()=>navigate(-1)} aria-label="Previous photograph"><ChevronLeft/></button>
      <button className="orbit-play" onClick={()=>setPaused(!paused)} aria-label={paused?'Resume rotation':'Pause rotation'}>{paused?<Play/>:<Pause/>}</button>
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
