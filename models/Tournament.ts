import mongoose from 'mongoose'

const StandingSchema = new mongoose.Schema(
  {
    placement: Number,
    gamerTag: String,
    playerId: String,
    setsWon: { type: Number, default: 0 },
    setsLost: { type: Number, default: 0 },
    points: Number,
  },
  { _id: false }
)

const TournamentSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  number: { type: Number, required: true },
  date: { type: Date, required: true },
  entrantsCount: { type: Number, default: 0 },
  eventId: { type: Number, required: true },
  standings: [StandingSchema],
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Tournament ||
  mongoose.model('Tournament', TournamentSchema)
