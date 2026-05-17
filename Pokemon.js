import mongoose from 'mongoose';

const statSchema = new mongoose.Schema(
  {
    hp: { type: Number, default: 0 },
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    specialAttack: { type: Number, default: 0 },
    specialDefense: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
  },
  { _id: false }
);

const pokemonSchema = new mongoose.Schema(
  {
    dexNumber: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true },
    types: [{ type: String, index: true }],
    generation: { type: Number, required: true, index: true },
    region: { type: String, required: true, index: true },
    stats: statSchema,
    sprite: String,
    artwork: String,
    height: Number,
    weight: Number,
    description: String,
    isLegendary: { type: Boolean, default: false },
    isMythical: { type: Boolean, default: false },
    pokemonClass: { type: String, default: 'STANDARD' },
    evolutionChainId: { type: Number, index: true },
    evolvesFrom: { type: Number, default: null },
    evolvesTo: [{ type: Number }],
    abilities: [String],
  },
  { timestamps: true }
);

pokemonSchema.index({ name: 'text' });

export default mongoose.model('Pokemon', pokemonSchema);
