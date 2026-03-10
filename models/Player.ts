import mongoose from 'mongoose'

const PlayerSchema = new mongoose.Schema({
  gamerTag: { type: String, required: true },
  startggUserId: { type: String },
  startggSlug: { type: String },
  slug: { type: String, required: true, unique: true },
  main: { type: String, default: '' },
  totalPoints: { type: Number, default: 0 },
  stats: {
    setsWon: { type: Number, default: 0 },
    setsLost: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    bestPlacement: { type: Number, default: 999 },
    tournamentsAttended: { type: Number, default: 0 },
  },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Player ||
  mongoose.model('Player', PlayerSchema)
