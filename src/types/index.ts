// --- Domain types ---

export type Gender = "Male" | "Female";
export type ProgramGender = "Coed" | "Male" | "Female";

export interface Player {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: Gender;
}

export interface Program {
  id: string;
  name: string;
  gender: ProgramGender;
  min: number;
  max: number;
  fee: number;
  closed?: boolean;
  ageAsOfDate: string | null;
}

export interface Season {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  programs: Program[];
}

export interface SeasonConfig {
  name: string;
  programs: Program[];
  waivers: Waiver[];
}

export interface Waiver {
  id: string;
  title: string;
  required: boolean;
  coachOnly?: boolean;
  content: string;
}

export interface SportType {
  name: string;
  gender: ProgramGender;
  min: number;
  max: number;
  fee: number;
}

// --- Registration / Cart types ---

export interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface CartItemGuardian {
  primary: ContactInfo;
  secondary: ContactInfo | null;
  primaryContactPhone: string;
}

export interface CartItem {
  id: string;
  player: Player;
  program: Program;
  hat: string;
  jersey: string;
  guardian: CartItemGuardian;
  digitalPicture: boolean;
  extraHat: { size: string } | null;
  coaching: string;
  coachShirtSize: string | null;
  sponsorship: string;
  sponsorName: string | null;
  medical: { allergies: string | null; info: string | null } | null;
  total: number;
}

// --- Admin types ---

export interface AdminRegistration {
  id: string;
  player: string;
  gender: Gender;
  dob: string;
  program: string;
  parent: string;
  email: string;
  primaryContact: string;
  fee: number;
  status: "Completed" | "Pending";
  date: string;
  hat: string;
  jersey: string;
  digitalPic: boolean;
  extraHat: string | null;
  coaching: string;
  sponsorship: string;
  total: number;
}

export interface AdminColumn {
  id: string;
  label: string;
  default: boolean;
}

// --- User types ---

export interface CurrentUser {
  firstName: string;
  lastName: string;
  phone: string;
  secondaryGuardian: ContactInfo;
}

// --- Context types ---

export interface AppContextValue {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  players: Player[];
  addPlayer: (player: Player) => void;
  seasons: Season[];
  activeSeason: Season | null;
  addSeason: (season: Season) => void;
  updateSeason: (id: string, updates: Partial<Season>) => void;
  deleteSeason: (id: string) => void;
  activateSeason: (id: string) => void;
  deactivateSeason: (id: string) => void;
}
