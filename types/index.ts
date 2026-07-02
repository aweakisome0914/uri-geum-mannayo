export type Mood = 'gentle' | 'romantic' | 'warm'

export type LovePage = {
  id:               string
  ownerUid:         string
  imageUrls:        string[]
  imageCount:       number
  message:          string
  anniversaryDate:  string
  nextMeetingDate?: string | null
  mood:             Mood
  secretCodeHash:   string
  // createdAt は Firestore Timestamp のため UI 型からは除外
}
