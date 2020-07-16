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
  koreaBaseball: [String],
  koreaBasketball: [String],
  koreaSoccer: [String],
  worldBaseball: [String],
  worldBasketball: [String],
  worldSoccer: [String],
  esports: [String],
});

const Sports = mongoose.model<SportsSchemaInterface>('Sports', SportsSchema);
export default Sports;
