export const weddingData = {
  couple: {
    groom: 'Rupak Gola',
    bride: 'Anshika Prajapati',
  },
  date: {
    display: '22 February 2027',
    iso: '2027-02-22T12:00:00',
  },
}

export type GalleryCategory =
  | 'Pre-Wedding Highlights'
  | 'Romantic Moments'
  | 'Traditional Looks'
  | 'Outdoor Photoshoot'
  | 'Candid Moments'
  | 'Couple Portraits'
  | 'Behind The Scenes'

export type GalleryPhoto = {
  src: string
  category: GalleryCategory
  caption: string
  size?: 'wide' | 'tall' | 'standard'
}

// Keep engagement and pre-wedding photographs in separate, independently editable collections.
export const preWeddingPhotos: GalleryPhoto[] = [
  { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=88', category: 'Pre-Wedding Highlights', caption: 'The beginning of forever', size: 'tall' },
  { src: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1400&q=88', category: 'Romantic Moments', caption: 'A thousand little moments', size: 'wide' },
  { src: 'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=1400&q=88', category: 'Traditional Looks', caption: 'Tradition, held close', size: 'standard' },
  { src: 'https://images.unsplash.com/photo-1616422203089-a44c72a5a7db?auto=format&fit=crop&w=1400&q=88', category: 'Outdoor Photoshoot', caption: 'Where the sky met our story', size: 'tall' },
  { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=88', category: 'Candid Moments', caption: 'Laughter in between poses', size: 'standard' },
  { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=88', category: 'Couple Portraits', caption: 'Two souls, one frame', size: 'wide' },
  { src: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=1400&q=88', category: 'Behind The Scenes', caption: 'The moments before the moments', size: 'standard' },
]

export type EngagementCategory =
  | 'Ring Ceremony'
  | 'Couple Portrait'
  | 'Ring Exchange'
  | 'Family Celebration'
  | 'Candid Moment'
  | 'Stage & Decoration'
  | 'Couple Close-up'

export type EngagementPhoto = {
  src: string
  category: EngagementCategory
  caption: string
}

export const engagementPhotos: EngagementPhoto[] = [
  { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=88', category: 'Ring Ceremony', caption: 'The promise begins' },
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=88', category: 'Couple Portrait', caption: 'Our yes, beautifully captured' },
  { src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1600&q=88', category: 'Ring Exchange', caption: 'A ring, a vow, a forever' },
  { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=88', category: 'Family Celebration', caption: 'Blessings all around' },
  { src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1600&q=88', category: 'Candid Moment', caption: 'A little laughter, a lot of love' },
  { src: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1600&q=88', category: 'Stage & Decoration', caption: 'Made magical for our moment' },
  { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=88', category: 'Couple Close-up', caption: 'Closer to forever' },
]

// Backward-compatible alias for existing imports.
export const galleryPhotos = preWeddingPhotos
