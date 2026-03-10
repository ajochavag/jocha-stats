import mongoose from 'mongoose'

const SetSchema = new mongoose.Schema({
  startggSetId: { type: String, required: true, unique: true },
  tournamentSlug: { type: String, required: true },
  round: { type: String },
  player1: {
    gamerTag: String,
    playerId: String,
    score: Number,
  },
  player2: {
    gamerTag: String,
    playerId: String,
    score: Number,
  },
  winnerId: String,
  displayScore: String,
  date: { type: Date },
})

export default mongoose.models.Set || mongoose.model('Set', SetSchema)
