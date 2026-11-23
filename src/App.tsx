import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronRight, Clock3, Heart, MapPin, Menu, Music2, Pause, X } from 'lucide-react'
import './App.css'
import { JourneyGallery, ScratchReveal } from './PremiumFeatures'

const photos = {
  hero: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=1800&q=88',
  story1: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=85',
  story2: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1000&q=85',
  story3: 'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=1000&q=85',
  story4: 'https://images.unsplash.com/photo-1616422203089-a44c72a5a7db?auto=format&fit=crop&w=1000&q=85',
  bachelor: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=85',
  haldi: 'https://images.unsplash.com/photo-1597157589876-c2ee20f6c185?auto=format&fit=crop&w=1000&q=85',
  mehndi: 'https://images.unsplash.com/photo-1610173826608-ae8e4e9c0e1b?auto=format&fit=crop&w=1000&q=85',
  tilak: 'https://images.unsplash.com/photo-1604604436896-6b1e3a1bd8e4?auto=format&fit=crop&w=1000&q=85',
  sangeet: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85',
  wedding: 'https://images.unsplash.com/photo-1594749788379-e65f3c3d5a9f?auto=format&fit=crop&w=1500&q=88',
}

const events = [
  ['Bachelor Party', 'Groom’s Last Night of Freedom', '20 February 2027', '8:30 PM onwards', 'Venue to be confirmed', 'Complete address to be confirmed', 'An evening of brotherhood, laughter and golden memories.', 'Cocktail attire', photos.bachelor, '#c69a3a'],
  ['Haldi', 'Yellow Sunshine & Marigold Dreams', '21 February 2027', '11:00 AM', 'Venue to be confirmed', 'Complete address to be confirmed', 'A joyful morning wrapped in turmeric, marigolds and family warmth.', 'Yellow & ivory', photos.haldi, '#d5a21d'],
  ['Mehndi', 'Mehndi, Music & Memories', '21 February 2027', '4:00 PM', 'Venue to be confirmed', 'Complete address to be confirmed', 'Intricate henna, emerald elegance and melodies for every heart.', 'Emerald & festive', photos.mehndi, '#315c49'],
  ['Tilak', 'Shubh Tilak & Family Blessings', '21 February 2027', '6:30 PM', 'Venue to be confirmed', 'Complete address to be confirmed', 'A timeless ceremony where traditions and blessings unite families.', 'Traditional royal', photos.tilak, '#9b2d36'],
  ['Sangeet Night', 'Dance, Music & Celebration', '21 February 2027', '8:00 PM', 'Venue to be confirmed', 'Complete address to be confirmed', 'An exuberant night of music, dance and unforgettable stories.', 'Cocktail glam', photos.sangeet, '#b68a2f'],
  ['Wedding Ceremony', 'The Royal Wedding Celebration', '22 February 2027', 'Ceremony time to be confirmed', 'Venue to be confirmed', 'Complete address to be confirmed', 'With sacred vows and beloved blessings, we begin our forever.', 'Indian formal', photos.wedding, '#7c1d2d'],
]

function Ornament(){ return <div className="ornament"><span/><b>✦</b><span/></div> }

function App() {
  const [entered,setEntered]=useState(false)
  const [menuOpen,setMenuOpen]=useState(false)
  const [lightbox,setLightbox]=useState<string|null>(null)
  const [playing,setPlaying]=useState(false)
  const [submitted,setSubmitted]=useState(false)
  const [countdown,setCountdown]=useState([0,0,0,0])

  useEffect(()=>{ const update=()=>{ const diff=new Date('2027-02-22T12:00:00').getTime()-Date.now(); const safe=diff>0?diff:0; setCountdown([Math.floor(safe/86400000),Math.floor(safe/3600000)%24,Math.floor(safe/60000)%60,Math.floor(safe/1000)%60]) }; update(); const timer=window.setInterval(update,1000); return()=>window.clearInterval(timer)},[])
  const scrollTo=(id:string)=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenuOpen(false)}
  const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();setSubmitted(true)}

  return <>
    <AnimatePresence>{!entered&&<motion.div className="opening" initial={{opacity:1}} exit={{opacity:0,transition:{duration:1}}}>
      <div className="opening-pattern"/><div className="petals">{Array.from({length:14},(_,i)=><i key={i}/>)}</div>
      <motion.div className="invitation-card" initial={{y:30,scale:.96,opacity:0}} animate={{y:0,scale:1,opacity:1}} transition={{duration:1.2}}>
        <div className="invitation-border"><p className="eyebrow">With the blessings of God and our beloved families</p><h2>Two Souls,<br/><em>One Beautiful Journey</em></h2><div className="opening-names">Rupak <span>&</span> Anshika</div><p className="opening-copy">Together with our families, we invite you to celebrate our wedding.</p><button className="enter-button" onClick={()=>setEntered(true)}>Enter Invitation <ChevronRight size={16}/></button></div>
      </motion.div>
    </motion.div>}</AnimatePresence>

    <div className="site-shell">
      <header className="topbar"><button className="monogram" onClick={()=>scrollTo('home')}>R<span>&</span>A</button><nav className={menuOpen?'nav open':'nav'}><button onClick={()=>scrollTo('story')}>Our Story</button><button onClick={()=>scrollTo('events')}>Celebrations</button><button onClick={()=>scrollTo('family')}>Family</button><button onClick={()=>scrollTo('rsvp')}>RSVP</button></nav><button className="menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen?<X/>:<Menu/>}</button></header>
      <main>
        <section className="hero-section" id="home"><img src={photos.hero} alt="Royal Indian wedding celebration"/><div className="hero-shade"/><div className="hero-copy"><motion.p initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>The Wedding Celebration</motion.p><motion.h1 initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} transition={{duration:1}} viewport={{once:true}}>Rupak <span>&</span> Anshika</motion.h1><div className="hero-date"><span/>22 · 02 · 2027<span/></div><p className="hero-tagline">Join us as we begin our forever.</p><div className="hero-actions"><button className="gold-button" onClick={()=>scrollTo('events')}>Explore Wedding</button><button className="outline-button" onClick={()=>navigator.clipboard?.writeText('22 February 2027 — Rupak & Anshika')}>Save the Date</button></div></div><button className="music-button" onClick={()=>setPlaying(!playing)} aria-label={playing?'Pause music':'Play music'}>{playing?<Pause/>:<Music2/>}</button></section>

        <ScratchReveal onContinue={()=>scrollTo('story')} />

        <JourneyGallery />

        <section className="countdown-section"><p>Counting every moment</p><h2>Until We Say <em>I Do</em></h2><div className="countdown-grid">{['Days','Hours','Minutes','Seconds'].map((label,i)=><div className="countdown-unit" key={label}><strong>{String(countdown[i]).padStart(2,'0')}</strong><span>{label}</span></div>)}</div></section>

        <section className="events section" id="events"><div className="section-heading"><p>The Wedding Calendar</p><h2>Celebrations of<br/><em>Love & Togetherness</em></h2><Ornament/></div><div className="event-list">{events.map((event,i)=><motion.article className={`event-card ${i%2?'reverse':''}`} key={event[0]} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}}><div className="event-image"><img src={event[8]} alt={`${event[0]} celebration`}/><span>{String(i+1).padStart(2,'0')}</span></div><div className="event-info" style={{'--event-color':event[9]} as CSSProperties}><p className="event-kicker">{event[1]}</p><h3>{event[0]}</h3><div className="event-meta"><span><CalendarDays/> {event[2]}</span><span><Clock3/> {event[3]}</span></div><p className="event-desc">{event[6]}</p><div className="venue-line"><MapPin/><div><strong>{event[4]}</strong><small>{event[5]}</small></div></div><p className="dress-code">Dress code · {event[7]}</p><a className="directions" href="https://www.google.com/maps" target="_blank" rel="noreferrer">Get Directions <ChevronRight size={16}/></a></div></motion.article>)}</div></section>

        <section className="family section" id="family"><div className="family-arch"><img src={photos.wedding} alt="Groom's family celebration"/></div><div className="family-copy"><p>With Love & Blessings From</p><h2>The Gola <em>Family</em></h2><Ornament/><blockquote>“Two families, countless blessings, and one beautiful promise.”</blockquote><div className="family-names"><div><span>Grandparents</span><strong>With our blessings</strong></div><div><span>Parents</span><strong>Names to be added</strong></div><div><span>Family</span><strong>Brothers, sisters & loved ones</strong></div></div></div></section>

        <section className="rsvp section" id="rsvp"><div className="rsvp-card"><div className="rsvp-heading"><p>Your presence means the world</p><h2>Kindly <em>RSVP</em></h2><Ornament/></div>{submitted?<motion.div className="success" initial={{scale:.8,opacity:0}} animate={{scale:1,opacity:1}}><Heart fill="currentColor"/><h3>Thank you!</h3><p>Your response has been lovingly received.</p><button onClick={()=>setSubmitted(false)}>Send another response</button></motion.div>:<form onSubmit={submit}><div className="form-grid"><label>Guest Name<input required name="name" placeholder="Your full name"/></label><label>Family / Group Name<input name="family" placeholder="Family name"/></label><label>Number of Guests<select name="guests"><option>1 guest</option><option>2 guests</option><option>3 guests</option><option>4 guests</option><option>5+ guests</option></select></label><label>Contact Number<input name="phone" type="tel" placeholder="+91"/></label></div><fieldset><legend>Which functions will you attend?</legend><div className="function-options">{events.map(e=><label key={e[0]}><input type="checkbox" name="functions" value={e[0]}/><span>{e[0]}</span></label>)}</div></fieldset><label>Special Message<textarea name="message" rows={3} placeholder="A blessing or special note"/></label><button className="submit-button" type="submit">Confirm Attendance <Heart size={16}/></button></form>}</div></section>

        <section className="final-section"><div className="final-pattern"/><motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><p className="final-quote">“Some journeys are beautiful,<br/>but the journey together is forever.”</p><h2>Rupak Gola <span>❤️</span> Anshika Prajapati</h2><p className="final-copy">We would be honoured to have your presence and blessings<br/>as we begin this beautiful new chapter.</p><div className="final-sign"><small>With Love</small><strong>The Groom’s Family</strong></div><h3>See You at the Wedding!</h3></motion.div></section>
      </main>
      <AnimatePresence>{lightbox&&<motion.div className="lightbox" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setLightbox(null)}><button aria-label="Close photo"><X/></button><img src={lightbox} alt="Expanded wedding gallery view"/></motion.div>}</AnimatePresence>
    </div>
  </>
}
export default App
