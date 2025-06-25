import {BaseRequest} from "@/game/network/RequestPackets.ts";

/**
 * Аналог C# ResponsePackets.
 * Описание интерфейсов пакетов, которые приходят с сервера.
 */
export interface IPacket {
  type: string;
}

export interface BasePacket extends IPacket {
  type: string;
}
export interface SignatureExpiredPacket extends IPacket {
  type: string;
}

export interface EmotePacket extends IPacket {
  type: string;
  player: string;
  emote: string;
}

export interface ChangeBetPacket extends IPacket {
  type: string;
  players: string[];

}


export interface ChangeBetPacketAnswer extends IPacket {
  type: string;
  player_id: string;
}

export interface WelcomePacket extends IPacket {
  type: string;
  players: string[];
  info: {
    player_amount: number;
    bid: number;
    game_type: number;
  };
  available_state: string;
  states: string[];
  timers: [string, number][];
  extra: string;
  bat: number;
}

export interface TransferPacket extends IPacket {
  type: string;
  lobby_id: string;
  host: string;
}

export interface PlayerListUpdatePacket extends IPacket {
  type: string;
  players: string[];
  available_state: string;
  timers: [string, number][];
}

export interface PlayersStatesPacket extends IPacket {
  type: string;
  players: string[];
  states: string[];
  available_state: string;
  available_hand: string[]; 
  timers: [string, number][];
}

export interface StartGamePacket extends IPacket {
  type: string;
  players: string[];
  states: string[];
  available_state: string;
  card_amounts: number[];
  deck_cards: number;
  hand: string[];
  available_hand: string[];
  timers: { playerId: string; newEndTime: number }[];
  trump_card: string;
}

export interface TableUpdatePacket extends IPacket {
  type: string;
  table: string[][][]; // 3D array
  players: string[];
  states: string[];
  available_state: string;
  card_amounts: number[];
  deck_cards: number;
  hand: string[];
  available_hand: string[];
  timers: { playerId: string; timeLeft: number }[];
}

export interface EndRoundPacket extends IPacket {
  type: string;
  how: string; // "take" or "bat"
  table: string[][][];
  taker_id: string;
  hand: string[];
  card_amounts: number[];
  deck_cards: number;
}

export interface EndGamePacket extends IPacket {
  type: string;
  players: string[];
  order: Array<[number, number]>;
  first_game: number;
}

export interface WinnerPacket extends IPacket {
  type: string;
  currency: string;
  amount: number;
  reason: string;
  kick: number;
  extra: string;
}

export interface DurakPacket extends IPacket {
  type: string;
  currency: string;
  amount: number;
  reason: string;
  kick: number;
  extra: string;
}

export interface ReconnectionPacket extends IPacket {
  type: string;
  info: {
    player_amount: number;
    bid: number;
    game_type: number;
  };
  table: string[][][];
  players: string[];
  states: string[];
  available_state: string;
  card_amounts: number[];
  deck_cards: number;
  hand: string[];
  available_hand: string[];
  timers: [string, number][];
  trump_card: string;
  extra: string;
  bat: number;
}

export interface ReconnectionWelcomePacket extends IPacket {
  type: string;
  info: {
    player_amount: number;
    bid: number;
    game_type: number;
  };
  players: string[];
  states: string[];
  available_state: string;
  timers: [string, number][];
  extra: string;
  bat: number;
}

export interface KickPacket extends IPacket {
  type: string;
  reason: string;
}

export interface PongPacket extends IPacket {
  type: string;
}
