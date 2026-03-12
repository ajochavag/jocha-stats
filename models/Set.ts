import mongoose from 'mongoose'

const GameSchema = new mongoose.Schema(
  {
    gameNum: Number,
    winnerId: String,
    character1: { type: String, default: '' },
    character2: { type: String, default: '' },
  },
  { _id: false }
)

const SetSchema = new mongoose.Schema({
  startggSetId: { type: String, required: true, unique: true },
  tournamentSlug: { type: String, required: true },
  round: { type: String },
  player1: {
    gamerTag: String,
    playerId: String,
    score: Number,
    character: { type: String, default: '' },
  },
  player2: {
    gamerTag: String,
    playerId: String,
    score: Number,
    character: { type: String, default: '' },
  },
  winnerId: String,
  displayScore: String,
  date: { type: Date },
  games: [GameSchema],
})

export default mongoose.models.Set || mongoose.model('Set', SetSchema)