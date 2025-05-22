// EventService.ts
import type { Emitter, Handler } from 'mitt';
import mitt from 'mitt';
import { CardUtils } from '../utils/CardUtils';

// Enum для всех пакетов
export enum EventType {
  StartApplication = 'StartApplication',
  WelcomeOrReconnectionWelcome = 'WelcomeOrReconnectionWelcome',
  TryAttackOrDefend = 'TryAttackOrDefend',
  ConnectInvoked = 'ConnectInvoked',
  DisconnectInvoked = 'DisconnectInvoked',
  TryToReconnect = 'TryToReconnect',
  GameStarted = 'GameStarted',
  UnHighlight = 'UnHighlight',
  LanguageSet = 'LanguageSet',
  MyPlayerIdSet = 'MyPlayerIdSet',
  LobbyIdSet = 'LobbyIdSet',
  HostSet = 'HostSet',
  JwtSet = 'JwtSet',
  RefreshTokenSet = 'RefreshTokenSet',
  BalanceSet = 'BalanceSet',
  Kick = 'Kick',
  UpdateAvailableState = 'UpdateAvailableState',
  GameTypeSet = 'GameTypeSet',
  MaxCardAmountSet = 'MaxCardAmountSet',
  PlayerAmountSet = 'PlayerAmountSet',
  BidSet = 'BidSet',
  DeckCardAmountChanged = 'DeckCardAmountChanged',
  Transfer = 'Transfer',
  TrumpSet = 'TrumpSet',
  PlayerIDsSet = 'PlayerIDsSet',
  GameEnded = 'GameEnded',
  PlayerTimersChanged = 'PlayerTimersChanged',
  TableCardsChanged = 'TableCardsChanged',
  HandCardsChanged = 'HandCardsChanged',
  AvailableHandCardsChanged = 'AvailableHandCardsChanged',
  CardAmountsChanged = 'CardAmountsChanged',
  PlayerStatesChanged = 'PlayerStatesChanged',
  CardsTakenByPlayer = 'CardsTakenByPlayer',
  CardsMovedToDiscard = 'CardsMovedToDiscard',
  TakerIdSet = 'TakerIdSet',
  WinnerDeclared = 'WinnerDeclared',
  DurakDeclared = 'DurakDeclared',
  RefreshStates = 'RefreshStates',
  TransferIconShow = 'TransferIconShow',
  ShowTryLeavePopup = 'ShowTryLeavePanel',
  // ShowDebug = 'ShowDebug',
  Reconnect = 'Reconnect',
  SetTimeoutPercent = 'SetTimeoutPercent',
  SetMyState = 'SetMyState',
  HideMyTimer = 'HideMyTimer',
  PreviewHandCards = 'PreviewHandCards',
  ShowEmotionsPopup = 'ShowEmotionsPopup',
  // ShowChangeBetPopup = 'ShowEmotionsPopup',
  ShowOfferToChangeBetPopup = 'ShowOfferToChangeBetPopup',
  ShowEmote = 'ShowEmote',
  EmotionsCooldown = 'EmotionsCooldown',
  BetsReceived = 'BetsReceived',
  BetSelected = 'BetSelected',
}

// Описываем все события: ключ — название, значение — тип аргумента
type Events = {
  [key in EventType]: any; // Любой аргумент для каждого события (или указываем конкретный тип ниже)
};

// Специфичные типы аргументов для событий
export type EventPayloads = {
  [EventType.StartApplication]: void;
  [EventType.RefreshStates]: boolean;
  [EventType.WelcomeOrReconnectionWelcome]: void;
  [EventType.ConnectInvoked]: void;
  [EventType.DisconnectInvoked]: void;
  [EventType.TryToReconnect]: void;
  [EventType.GameStarted]: void;
  [EventType.UnHighlight]: void;
  [EventType.LanguageSet]: string;
  [EventType.MyPlayerIdSet]: string;
  [EventType.LobbyIdSet]: string;
  [EventType.HostSet]: string;
  [EventType.JwtSet]: string;
  [EventType.RefreshTokenSet]: string;
  [EventType.BalanceSet]: string;
  [EventType.Kick]: string;
  [EventType.UpdateAvailableState]: string;
  [EventType.GameTypeSet]: number;
  [EventType.Reconnect]: boolean;
  [EventType.MaxCardAmountSet]: number;
  [EventType.PlayerAmountSet]: number;
  [EventType.BidSet]: number;
  [EventType.DeckCardAmountChanged]: number;
  [EventType.Transfer]: { lobbyId: string; host: string };
  [EventType.TryAttackOrDefend]: CardUtils.Card;
  [EventType.TrumpSet]: CardUtils.Card;
  [EventType.PlayerIDsSet]: string[];
  [EventType.GameEnded]: number;
  [EventType.PlayerTimersChanged]: [string, number][];
  [EventType.TableCardsChanged]: CardUtils.TableTurn[];
  [EventType.HandCardsChanged]: CardUtils.Card[];
  [EventType.PreviewHandCards]: CardUtils.Card;
  [EventType.AvailableHandCardsChanged]: CardUtils.Card[];
  [EventType.CardAmountsChanged]: { playerIds: string[]; cardAmounts: number[] };
  [EventType.PlayerStatesChanged]: { playerIds: string[]; states: string[] };
  [EventType.CardsTakenByPlayer]: { playerId: string; cards: CardUtils.Card[] };
  [EventType.CardsMovedToDiscard]: CardUtils.Card[];
  [EventType.TakerIdSet]: string;
  [EventType.SetMyState]: string;
  [EventType.WinnerDeclared]: { currency: string; amount: number; reason: string; kick: number };
  [EventType.DurakDeclared]: { currency: string; amount: number; reason: string };
  [EventType.TransferIconShow]: { isVisible: boolean; posX: number; posY: number };
  [EventType.ShowTryLeavePopup]: void;
  // [EventType.ShowDebug]: void;
  [EventType.SetTimeoutPercent]: number;
  [EventType.HideMyTimer]: void;
  [EventType.ShowEmotionsPopup]: boolean;
  // [EventType.ShowChangeBetPopup]: boolean;
  [EventType.ShowOfferToChangeBetPopup]: number;
  [EventType.BetsReceived]: number[];
  [EventType.BetSelected]: number;
  [EventType.ShowEmote]: { playerId: string; emote: string };
  [EventType.EmotionsCooldown]: void;
};

export class EventService {
  private static _instance: EventService | null = null;
  public static get Instance(): EventService {
    if (!this._instance) {
      this._instance = new EventService();
    }
    return this._instance;
  }

  private emitter: Emitter<Events>;

  // Словарь для хранения обработчиков, если используется строковый ключ
  private handlers: { [event: string]: { [handlerKey: string]: Handler<any> } } = {};

  private constructor() {
    this.emitter = mitt<Events>();
  }

  // Перегрузки для метода `on`

  // Перегрузка 1: Подписка с явным строковым ключом
  public on<K extends keyof EventPayloads>(
      event: K,
      handlerKey: string,
      handler: Handler<EventPayloads[K]>
  ): void;

  // Перегрузка 2: Подписка без ключа, просто метод
  public on<K extends keyof EventPayloads>(
      event: K,
      handler: Handler<EventPayloads[K]>
  ): void;

  // Реализация метода `on`
  public on<K extends keyof EventPayloads>(
      event: K,
      handlerKeyOrMethod: string | Handler<EventPayloads[K]>,
      handler?: Handler<EventPayloads[K]>
  ) {

    // Если передан строковый ключ, используем словарь для хранения обработчика
    if (typeof handlerKeyOrMethod === 'string') {
      if (!this.handlers[event as string]) {
        this.handlers[event as string] = {};
      }
      this.handlers[event as string][handlerKeyOrMethod] = handler!;
      this.emitter.on(event, handler!);
    } else {
      // Если передан только метод, привязываем его напрямую
      this.emitter.on(event, handlerKeyOrMethod);
    }
  }

  // Перегрузки для метода `off`

  // Перегрузка 1: Отписка с явным строковым ключом
  public off<K extends keyof EventPayloads>(event: K, handlerKey: string): void;

  // Перегрузка 2: Отписка без ключа, просто метод
  public off<K extends keyof EventPayloads>(event: K, handler: Handler<EventPayloads[K]>): void;

  // Реализация метода `off`
  public off<K extends keyof EventPayloads>(
      event: K,
      handlerKeyOrMethod: string | Handler<EventPayloads[K]>
  ) {

    // Если передан строковый ключ, ищем обработчик в словаре
    if (typeof handlerKeyOrMethod === 'string') {
      const handler = this.handlers[event as string]?.[handlerKeyOrMethod];
      if (handler) {
        this.emitter.off(event, handler);
        delete this.handlers[event as string][handlerKeyOrMethod];
      }
    } else {
      // Если передан метод, отписываемся напрямую
      this.emitter.off(event, handlerKeyOrMethod);
    }
  }

  /**
   * Вызов события с переданным полезным нагрузом
   * @param event — событие
   * @param payload — полезная нагрузка
   */
  public emit<K extends keyof EventPayloads>(event: K, payload: EventPayloads[K]) {
    //console.log(`Invoke event '${event}'`);
    this.emitter.emit(event, payload);
  }

  /**
   * Очистка всех слушателей
   */
  public clearAllListeners() {
    console.log("Clear all listeners");
    for (const event in this.handlers) {
      for (const handlerKey in this.handlers[event]) {
        this.emitter.off(event as keyof EventPayloads, this.handlers[event][handlerKey]);
      }
    }
    this.handlers = {};
  }
}