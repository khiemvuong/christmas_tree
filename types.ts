export interface WishRequest {
  name: string;
  relationship: string;
}

export interface SnowFlake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wind: number;
}

export enum LightColor {
  WARM_WHITE = 'bg-yellow-100 shadow-[0_0_10px_2px_rgba(254,240,138,0.8)]',
  MULTI = 'bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.8)]', // Dynamic assignment in component
  BLUE = 'bg-blue-400 shadow-[0_0_10px_2px_rgba(96,165,250,0.8)]'
}