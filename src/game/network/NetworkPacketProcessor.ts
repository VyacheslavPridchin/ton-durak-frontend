import { EventService, EventType } from './EventService';
import type {
  BasePacket,
  TransferPacket,
  SignatureExpiredPacket,
  WelcomePacket,
  PlayerListUpdatePacket,
  PlayersStatesPacket,
  StartGamePacket,
  TableUpdatePacket,
  EndRoundPacket,
  EndGamePacket,
  WinnerPacket,
  DurakPacket,
  ReconnectionPacket,
  ReconnectionWelcomePacket,
  KickPacket, PongPacket, EmotePacket,
} from './ResponsePackets';
import { CardUtils } from '../utils/CardUtils';
import PlayerSettingsStorage from './PlayerSettingsStorage';
import NetworkManager from "./NetworkManager.ts";
import {Validator} from "../utils/Validator.ts";

export class NetworkPacketProcessor {
  private static packetHandlers: Record<string, (json: string) => void> = {
    "transfer": (json) => NetworkPacketProcessor.handlePacket<TransferPacket>(json, NetworkPacketProcessor.handleTransferPacket),
    "signature_expired": (json) => NetworkPacketProcessor.handlePacket<SignatureExpiredPacket>(json, NetworkPacketProcessor.handleSignatureExpiredPacket),
    "welcome": (json) => NetworkPacketProcessor.handlePacket<WelcomePacket>(json, NetworkPacketProcessor.handleWelcomePacket),
    "new_player": (json) => NetworkPacketProcessor.handlePacket<PlayerListUpdatePacket>(json, NetworkPacketProcessor.handlePlayerListUpdate),
    "player_left": (json) => NetworkPacketProcessor.handlePacket<PlayerListUpdatePacket>(json, NetworkPacketProcessor.handlePlayerListUpdate),
    "players_states": (json) => NetworkPacketProcessor.handlePacket<PlayersStatesPacket>(json, NetworkPacketProcessor.handlePlayersStates),
    "start_game": (json) => NetworkPacketProcessor.handlePacket<StartGamePacket>(json, NetworkPacketProcessor.handleStartGame),
    "table": (json) => NetworkPacketProcessor.handlePacket<TableUpdatePacket>(json, NetworkPacketProcessor.handleTableUpdate),
    "end_round": (json) => NetworkPacketProcessor.handlePacket<EndRoundPacket>(json, NetworkPacketProcessor.handleEndRoundPacket),
    "end_game": (json) => NetworkPacketProcessor.handlePacket<EndGamePacket>(json, NetworkPacketProcessor.handleEndGamePacket),
    "winner": (json) => NetworkPacketProcessor.handlePacket<WinnerPacket>(json, NetworkPacketProcessor.handleWinnerPacket),
    "durak": (json) => NetworkPacketProcessor.handlePacket<DurakPacket>(json, NetworkPacketProcessor.handleDurakPacket),
    "reconnection": (json) => NetworkPacketProcessor.handlePacket<ReconnectionPacket>(json, NetworkPacketProcessor.handleReconnection),
    "reconnection_welcome": (json) => NetworkPacketProcessor.handlePacket<ReconnectionWelcomePacket>(json, NetworkPacketProcessor.handleReconnectionWelcome),
    "kick": (json) => NetworkPacketProcessor.handlePacket<KickPacket>(json, NetworkPacketProcessor.handleKick),
    "pong": (json) => NetworkPacketProcessor.handlePacket<PongPacket>(json, NetworkPacketProcessor.handlePong),
    "emote": (json) => NetworkPacketProcessor.handlePacket<EmotePacket>(json, NetworkPacketProcessor.handleEmotePacket),
  };

  public static processPacket(json: string): void {
    const basePacket: BasePacket = JSON.parse(json);
    console.log(`Process packet '${basePacket.type}':`, json);

    const handler = NetworkPacketProcessor.packetHandlers[basePacket.type];
    if (!handler) {
      console.warn(`Unknown packet type: ${basePacket.type}`);
      return;
    }

    handler(json);
  }

  private static handlePacket<T>(json: string, handler: (packet: T) => void): void {
    const packet: T = JSON.parse(json);
    handler(packet);
  }

  private static setResortedPlayerIds(players: string[]): void {

    const currentPlayerId = PlayerSettingsStorage?.playerId;
  
    if (!currentPlayerId) {
      console.error('Player ID is undefined.');
      return;
    }
  
    const index = players.indexOf(currentPlayerId);
  
    const sortedPlayers =
      index !== -1
        ? [...players.slice(index), ...players.slice(0, index)].filter((id) => id !== currentPlayerId)
        : players;
  
    EventService.Instance.emit(EventType.PlayerIDsSet, sortedPlayers);
  }

  private static handleEmotePacket(packet: EmotePacket): void {
    console.log(packet);

    EventService.Instance.emit(EventType.ShowEmote, {
      playerId: packet.player,
      emote: packet.emote,
    });
  }

  private static handleTransferPacket(packet: TransferPacket): void {
    EventService.Instance.emit(EventType.GameEnded, 0);

    EventService.Instance.emit(EventType.Transfer, {
      lobbyId: packet.lobby_id,
      host: packet.host,
    });
  }

  private static async handleSignatureExpiredPacket(packet: SignatureExpiredPacket): Promise<void> {
    console.log(`Signature was expire: ${packet}`);
    NetworkManager.RefreshTokens();
  }

  private static handleWelcomePacket(packet: WelcomePacket): void {
    EventService.Instance.emit(EventType.PlayerAmountSet, packet.info.player_amount);
    EventService.Instance.emit(EventType.BidSet, packet.info.bid);
    EventService.Instance.emit(EventType.GameTypeSet, packet.info.game_type);
    NetworkPacketProcessor.setResortedPlayerIds(packet.players);
    EventService.Instance.emit(EventType.UpdateAvailableState, packet.available_state);
    EventService.Instance.emit(EventType.PlayerTimersChanged, packet.timers);
    EventService.Instance.emit(EventType.PlayerStatesChanged, {
      playerIds: packet.players,
      states: packet.states,
    });
    EventService.Instance.emit(EventType.BalanceSet, packet.extra);
    EventService.Instance.emit(EventType.WelcomeOrReconnectionWelcome, undefined);
    NetworkPacketProcessor.setBatIsComplete(packet.bat);
  }

  private static handlePlayerListUpdate(packet: PlayerListUpdatePacket): void {
    NetworkPacketProcessor.setResortedPlayerIds(packet.players);
    EventService.Instance.emit(EventType.PlayerTimersChanged, packet.timers);
    EventService.Instance.emit(EventType.UpdateAvailableState, packet.available_state);
  }

  private static handlePlayersStates(packet: PlayersStatesPacket): void {
    EventService.Instance.emit(EventType.PlayerStatesChanged, {
      playerIds: packet.players,
      states: packet.states,
    });
    EventService.Instance.emit(EventType.PlayerTimersChanged, packet.timers);
    EventService.Instance.emit(EventType.UpdateAvailableState, packet.available_state);

    if (packet.available_hand) {
      EventService.Instance.emit(
        EventType.AvailableHandCardsChanged,
        NetworkPacketProcessor.parseHand(packet.available_hand)
      );
    } else {
      EventService.Instance.emit(EventType.AvailableHandCardsChanged, []);
    }
  }

  private static handleStartGame(packet: StartGamePacket): void {
    EventService.Instance.emit(EventType.MaxCardAmountSet, packet.deck_cards);
    console.log(packet);
    NetworkPacketProcessor.handleCommonGameState(
      packet.players,
      packet.card_amounts,
      packet.deck_cards,
      packet.hand,
      packet.states,
      packet.timers,
      packet.available_hand,
      packet.available_state
    );

    const trumpCardOut: { card?: CardUtils.Card } = {};
    if (CardUtils.tryParseCardCode(packet.trump_card, trumpCardOut)) {
      EventService.Instance.emit(EventType.TrumpSet, trumpCardOut.card!);
    }

    EventService.Instance.emit(EventType.UpdateAvailableState, packet.available_state);
    EventService.Instance.emit(EventType.GameStarted, undefined);
  }

  private static handleTableUpdate(packet: TableUpdatePacket): void {
    NetworkPacketProcessor.handleCommonGameState(
      packet.players,
      packet.card_amounts,
      packet.deck_cards,
      packet.hand,
      packet.states,
      packet.timers,
      packet.available_hand,
      packet.available_state
    );
    const tableTurns = NetworkPacketProcessor.parseTableTurns(packet.table);
    EventService.Instance.emit(EventType.TableCardsChanged, tableTurns);
  }

  private static handleEndRoundPacket(packet: EndRoundPacket): void {
    if (packet.how === 'take') {
      if (packet.taker_id === PlayerSettingsStorage.playerId) {
        EventService.Instance.emit(EventType.HandCardsChanged, NetworkPacketProcessor.parseHand(packet.hand));
      } else {
        EventService.Instance.emit(EventType.TakerIdSet, packet.taker_id);
        const takenCards = NetworkPacketProcessor.extractCardsFromTable(packet.table);
        EventService.Instance.emit(EventType.CardsTakenByPlayer, {
          playerId: packet.taker_id,
          cards: takenCards,
        });
      }
    } else if (packet.how === 'bat') {
      EventService.Instance.emit(EventType.TakerIdSet, '');
      const discardedCards = NetworkPacketProcessor.extractCardsFromTable(packet.table);
      EventService.Instance.emit(EventType.CardsMovedToDiscard, discardedCards);
    }
    EventService.Instance.emit(EventType.TableCardsChanged, []);
  }

  private static handleEndGamePacket(packet: EndGamePacket): void {
    EventService.Instance.emit(EventType.GameEnded, packet.first_game);
  }

  private static handleWinnerPacket(packet: WinnerPacket): void {
    EventService.Instance.emit(EventType.WinnerDeclared, {
      currency: packet.currency,
      amount: packet.amount,
      reason: packet.reason,
      kick: packet.kick,
    });

    EventService.Instance.emit(EventType.BalanceSet, packet.extra);

    if(packet.kick == 1)
    {
      NetworkManager.reconnectionRequired = false;
    }
  }

  private static handleDurakPacket(packet: DurakPacket): void {
    EventService.Instance.emit(EventType.DurakDeclared, {
      currency: packet.currency,
      amount: packet.amount,
      reason: packet.reason,
    });

    EventService.Instance.emit(EventType.BalanceSet, packet.extra);
  }

  private static handleReconnection(packet: ReconnectionPacket): void {
    NetworkPacketProcessor.handleWelcomePacket({
      ...packet,
      type: 'welcome',
    } as WelcomePacket);

    NetworkPacketProcessor.handleCommonGameState(
      packet.players,
      packet.card_amounts,
      packet.deck_cards,
      packet.hand,
      packet.states,
      packet.timers,
      packet.available_hand,
      packet.available_state
    );

    const trumpCardOut: { card?: CardUtils.Card } = {};
    if (CardUtils.tryParseCardCode(packet.trump_card, trumpCardOut)) {
      EventService.Instance.emit(EventType.TrumpSet, trumpCardOut.card!);
    }

    EventService.Instance.emit(EventType.MaxCardAmountSet, packet.deck_cards);

    const tableTurns = NetworkPacketProcessor.parseTableTurns(packet.table);
    EventService.Instance.emit(EventType.TableCardsChanged, tableTurns);

    EventService.Instance.emit(EventType.GameStarted, undefined);

    NetworkPacketProcessor.setBatIsComplete(packet.bat);
  }

  private static handleReconnectionWelcome(packet: ReconnectionWelcomePacket): void {
    EventService.Instance.emit(EventType.PlayerAmountSet, packet.info.player_amount);
    EventService.Instance.emit(EventType.BidSet, packet.info.bid);
    EventService.Instance.emit(EventType.GameTypeSet, packet.info.game_type);
    NetworkPacketProcessor.setResortedPlayerIds(packet.players);
    EventService.Instance.emit(EventType.UpdateAvailableState, packet.available_state);
    EventService.Instance.emit(EventType.PlayerTimersChanged, packet.timers);
    EventService.Instance.emit(EventType.PlayerStatesChanged, {
      playerIds: packet.players,
      states: packet.states,
    });
    EventService.Instance.emit(EventType.BalanceSet, packet.extra);
    EventService.Instance.emit(EventType.WelcomeOrReconnectionWelcome, undefined);
    NetworkPacketProcessor.setBatIsComplete(packet.bat);
  }


  private static handlePong(packet: PongPacket): void {
    console.log('Pong received.');
  }

  private static handleKick(packet: KickPacket): void {
    NetworkManager.reconnectionRequired = false;
    console.log("NetworkManager.reconnectionRequired = false;", NetworkManager.reconnectionRequired);
    EventService.Instance.emit(EventType.Kick, packet.reason);
  }

  private static handleCommonGameState(
    players: string[],
    cardAmounts: number[],
    deckCards: number,
    hand: string[],
    states: string[],
    timers: any[],
    availableHand: string[],
    availableState: string
  ): void {
    //console.log('handleCommonGameState!');
    const handCards = NetworkPacketProcessor.parseHand(hand);
    const availableHandCards = NetworkPacketProcessor.parseHand(availableHand);

    //console.log(`handCards: ${handCards}`);
    //console.log(`availableHandCards: ${availableHandCards}`);

    EventService.Instance.emit(EventType.CardAmountsChanged, { playerIds: players, cardAmounts });
    EventService.Instance.emit(EventType.DeckCardAmountChanged, deckCards);
    EventService.Instance.emit(EventType.HandCardsChanged, handCards);
    EventService.Instance.emit(EventType.AvailableHandCardsChanged, availableHandCards);
    EventService.Instance.emit(EventType.UpdateAvailableState, availableState);
    EventService.Instance.emit(EventType.PlayerStatesChanged, { playerIds: players, states });
    EventService.Instance.emit(EventType.PlayerTimersChanged, timers);
  }

  private static parseHand(hand: string[]): CardUtils.Card[] {
      //console.debug(`parseHand: received hand=${JSON.stringify(hand)}`);

      const parsedCards = hand
          .map((code) => {
              //console.debug(`parseHand: processing code="${code}"`);
              const outCard: { card?: CardUtils.Card } = {};
              if (CardUtils.tryParseCardCode(code, outCard)) {
                  //console.debug(`parseHand: successfully parsed card=${JSON.stringify(outCard.card)}`);
                  return outCard.card;
              }
              //console.warn(`parseHand: failed to parse code="${code}"`);
              return null;
          })
          .filter((card): card is CardUtils.Card => card !== null); // Убираем `null`

      //console.debug(`parseHand: parsed cards=${JSON.stringify(parsedCards)}`);
      return parsedCards;
  }

  private static setBatIsComplete(isComplete: number): void {
    Validator.SetBatComplete(isComplete == 1);
  }


  private static parseTableTurns(table: string[][][]): CardUtils.TableTurn[] {
    return table.map((pair) => {
      const attackCardOut: { card?: CardUtils.Card } = {};
      if (
        !pair[0] || 
        !CardUtils.tryParseCardCode(pair[0][1], attackCardOut) || 
        !attackCardOut.card
      ) {
        console.error(`Invalid attack card in table pair:`, pair);
        throw new Error('Invalid attack card in table pair');
      }
  
      // Устанавливаем ownerId для карты
      const attackCard: CardUtils.Card = attackCardOut.card;

      PlayerSettingsStorage.setCardOwner(CardUtils.getCardCode(attackCard), pair[0][0]);
  
      let defendCard: CardUtils.Card | undefined;
      if (pair[1]) {
        const defendCardOut: { card?: CardUtils.Card } = {};
        if (
          !CardUtils.tryParseCardCode(pair[1][1], defendCardOut) || 
          !defendCardOut.card
        ) {
          console.error(`Invalid defend card in table pair:`, pair);
          throw new Error('Invalid defend card in table pair');
        }
  
        defendCard = defendCardOut.card;
        PlayerSettingsStorage.setCardOwner(CardUtils.getCardCode(defendCard), pair[1][0]);
      }
  
      return { attackCard, defendCard };
    });
  }
  
  
  private static extractCardsFromTable(table: string[][][]): CardUtils.Card[] {
    const cards: CardUtils.Card[] = [];
    table.forEach((pair) => {
      pair.forEach(([_, cardCode]) => {
        const outCard: { card?: CardUtils.Card } = {};
        if (CardUtils.tryParseCardCode(cardCode, outCard) && outCard.card) {
          cards.push(outCard.card);
        }
      });
    });
    return cards;
  }
}
