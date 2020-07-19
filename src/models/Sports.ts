import mongoose, { Schema } from 'mongoose';

export interface SportsSchemaInterface extends mongoose.Document {
  koreaBaseball: string[];
  koreaBasketball: string[];
  koreaSoccer: string[];
  worldBaseball: string[];
  worldBasketball: string[];
  worldSoccer: string[];
  esports: string[];
}

export let SportsSchema = new Schema({
  koreaBaseball: { type: [String], default: [] },
  koreaBasketball: { type: [String], default: [] },
  koreaSoccer: { type: [String], default: [] },
  worldBaseball: { type: [String], default: [] },
  worldBasketball: { type: [String], default: [] },
  worldSoccer: { type: [String], default: [] },
  esports: { type: [String], default: [] },
});

const Sports = mongoose.model<SportsSchemaInterface>('Sports', SportsSchema);
export default Sports;
