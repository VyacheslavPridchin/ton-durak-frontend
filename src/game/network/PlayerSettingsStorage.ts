import type { EventPayloads } from './EventService'
import { EventService, EventType } from './EventService';

class PlayerSettingsStorage {
  private static _instance: PlayerSettingsStorage | null = null;

  public static get Instance(): PlayerSettingsStorage {
    if (!this._instance) {
      this._instance = new PlayerSettingsStorage();
    }
    return this._instance;
  }

  // Поля с их начальными значениями
  private _data: Record<string, any> = {
    playerId: '123',
    lobbyId: '',
    bid: 0,
    // jwt: '',
    // refreshToken: '',
    gameType: 0,
    playerState: '', // Хранит состояние текущего игрока
  };

  // Словарь владельцев карт
  private _cardOwners: Record<string, string> = {};
  private _playersCoordinate: Record<string, {x: number, y: number}> = {};

  private constructor() {
    console.log("Creating PlayerSettingsStorage");

    // Универсальная подписка на события
    this.subscribeToEvents([
      { event: EventType.MyPlayerIdSet, key: 'playerId' },
      { event: EventType.LobbyIdSet, key: 'lobbyId' },
      { event: EventType.BidSet, key: 'bid' },
      // { event: EventType.JwtSet, key: 'jwt' },
      // { event: EventType.RefreshTokenSet, key: 'refreshToken' },
      { event: EventType.GameTypeSet, key: 'gameType' },
    ]);

    // Подписка на изменение состояния игроков
    EventService.Instance.on(EventType.PlayerStatesChanged, this.updatePlayerState.bind(this));
  }

  // Универсальный метод подписки
  private subscribeToEvents(subscriptions: { event: EventType; key: string }[]): void {
    subscriptions.forEach(({ event, key }) => {
      EventService.Instance.on(event as keyof EventPayloads, (value: any) => {
        this._data[key] = value;
      });
    });
  }

  // Метод обновления состояния текущего игрока
  private updatePlayerState({ playerIds, states }: { playerIds: string[]; states: string[] }): void {
    const index = playerIds.indexOf(this._data.playerId); // Найти индекс текущего игрока по его ID
    if (index !== -1) {
      this._data.playerState = states[index];
      // console.log(`Updated state for player ${this._data.playerId}:`, this._data.playerState);
    }
  }

  // Методы для работы с владельцами карт
  public setPlayerCoordinate(playerId: string, coordinate: {x: number, y: number}): void {
    this._playersCoordinate[playerId] = coordinate;
    //console.log(`Player coordinate set: ${playerId} -> ${coordinate}`);
  }

  public getPlayerCoordinate(playerId: string): {x: number, y: number} | null {
    const coord = this._playersCoordinate[playerId] || null;
    //console.log(`Player coordinate retrieved: ${playerId} -> ${coord}`);
    return coord;
  }

  public setCardOwner(cardCode: string, playerId: string): void {
    this._cardOwners[cardCode] = playerId;
    //console.log(`Card owner set: ${cardCode} -> ${playerId}`);
  }

  public getCardOwner(cardCode: string): string | null {
    const owner = this._cardOwners[cardCode] || null;
    //console.log(`Card owner retrieved: ${cardCode} -> ${owner}`);
    return owner;
  }

  public clearCardOwners(): void {
    this._cardOwners = {};
    //console.log(`All card owners cleared.`);
  }

  // Геттеры для доступа к полям
  public get playerId(): string {
    return this._data.playerId;
  }

  public get lobbyId(): string {
    return this._data.lobbyId;
  }

  public get bid(): number {
    return this._data.bid;
  }
  //
  // public get jwt(): string {
  //   return this._data.jwt;
  // }
  //
  // public get refreshToken(): string {
  //   return this._data.refreshToken;
  // }

  public get gameType(): number {
    return this._data.gameType;
  }

  public get playerState(): string {
    return this._data.playerState;
  }

  public set playerState(state: string) {
    this._data.playerState = state;
  }
}

// Экспортируем Singleton
export default PlayerSettingsStorage.Instance;
