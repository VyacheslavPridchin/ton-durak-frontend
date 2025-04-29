import { EventService, EventType } from '../../../network/EventService';
import PlayerSettingsStorage from '../../../network/PlayerSettingsStorage';
import NetworkManager from '../../../network/NetworkManager';
import { AttackRequest, DefendRequest, CardServerInfo } from '../../../network/RequestPackets';
import { CardUtils } from '../../../utils/CardUtils';
import { Validator } from '../../../utils/Validator';
import { CardsManagerRef } from "../elements/CardsManagerRef.ts";

class TableController {
  private cachedTableCards: CardUtils.TableTurn[] = [];
  private previewTableCards: CardUtils.TableTurn[] = [];
  private transferIconPosition: { x: number; y: number } | null = null;
  private lastTableUpdate: number = 0;
  private playerStates: Map<string, string> = new Map();
  private playerCardAmounts: Map<string, number> = new Map();

  constructor() {
    EventService.Instance.on(EventType.TableCardsChanged, "TableController: updateTableCards", this.updateTableCards.bind(this));
    EventService.Instance.on(EventType.RefreshStates, "TableController: restoreTableCards", this.restoreTableCards.bind(this));
    EventService.Instance.on(EventType.TryAttackOrDefend, "TableController: handleTryAttackOrDefend", this.handleTryAttackOrDefend.bind(this));
    EventService.Instance.on(EventType.GameEnded, "TableController: clear", this.clear.bind(this));
    EventService.Instance.on(EventType.PlayerStatesChanged, "TableController: updatePlayerStates", this.updatePlayerStates.bind(this));
    EventService.Instance.on(EventType.CardAmountsChanged, "TableController: updateCardAmounts", this.updateCardAmounts.bind(this));
  }

  private updatePlayerStates({ playerIds, states }: { playerIds: string[]; states: string[] }) {
    playerIds.forEach((id, index) => {
      this.playerStates.set(id, states[index]);
    });
  }

  private updateCardAmounts({ playerIds, cardAmounts }: { playerIds: string[]; cardAmounts: number[] }) {
    playerIds.forEach((id, index) => {
      this.playerCardAmounts.set(id, cardAmounts[index]);
    });
  }

  private getDefenderCardAmount(): number | null {
    for (const [id, state] of this.playerStates.entries()) {
      if (state === "defend") {
        return this.playerCardAmounts.get(id) ?? null;
      }
    }
    return null;
  }

  private clearAllData(): void {
    this.playerStates.clear();
    this.playerCardAmounts.clear();
  }

    /**
   * Обработка события TryAttackOrDefend
   */
  private async handleTryAttackOrDefend(card: CardUtils.Card): Promise<void> {

    console.log("Invoke handleTryAttackOrDefend");

    const cardsManagerRef = CardsManagerRef.get();

    const position = cardsManagerRef.value.getCardPosition(card.rank, card.suit) || { x: 0, y: 0};
    if(position?.y > window.innerHeight - 210)
    {
      EventService.Instance.emit(EventType.RefreshStates, true);
      return;
    }    
  
    const currentState = PlayerSettingsStorage.playerState;
    const cardCode = CardUtils.getCardCode(card);
  
    // Копируем текущие cached карты в preview
    this.previewTableCards = [...this.cachedTableCards];
  
    if (currentState === 'attack' || currentState === 'bat' || currentState === 'pass') {

      if(Validator.IsCanAttack(this.cachedTableCards, card, this.getDefenderCardAmount())) {
        // Создаем новую запись для preview
        const previewTurn: CardUtils.TableTurn = {
          attackCard: {rank: card.rank, suit: card.suit},
          defendCard: undefined,
        };

        this.previewTableCards.push(previewTurn);

        // Обновляем стол с предварительным просмотром
        await this.updateTableCards(this.previewTableCards, true,  false);
        EventService.Instance.emit(EventType.PreviewHandCards, card);

        if(currentState === 'bat')
        {
          EventService.Instance.emit(EventType.HideMyTimer, undefined);
          EventService.Instance.emit(EventType.UpdateAvailableState, "");
        }

        // Отправить запрос AttackRequest на сервер
        const attackRequest = new AttackRequest(cardCode);
        NetworkManager.send(attackRequest);
      }
      else {
        EventService.Instance.emit(EventType.RefreshStates, true);
      }
  
    } else if (currentState === 'defend') {

      if(PlayerSettingsStorage.gameType == 1){
        const canTransfer: boolean = this.cachedTableCards.length > 0 && this.cachedTableCards.every(turn => !turn.defendCard);
        if(canTransfer) {
          if (this.isTransferIconClosest(card))
          {
            if(Validator.IsCanTransfer(this.cachedTableCards, card)) {

              // Cooldown
              if (Date.now() - this.lastTableUpdate < 500) {
                EventService.Instance.emit(EventType.RefreshStates, true);
                return;
              }

              PlayerSettingsStorage.playerState = 'attack';
              const previewTurn: CardUtils.TableTurn = {
                attackCard: {rank: card.rank, suit: card.suit},
                defendCard: undefined,
              };

              const previewTableWithTransfer = this.previewTableCards;
              previewTableWithTransfer.push(previewTurn);

              await this.updateTableCards(previewTableWithTransfer, true,  false);
              EventService.Instance.emit(EventType.PreviewHandCards, card);

              const currentState = PlayerSettingsStorage.playerState;
              if(currentState === 'take')
              {
                EventService.Instance.emit(EventType.HideMyTimer, undefined);
                EventService.Instance.emit(EventType.UpdateAvailableState, "");
              }

              const attackRequest = new AttackRequest(cardCode);
              NetworkManager.send(attackRequest);

              return;
            }
            else {
              EventService.Instance.emit(EventType.RefreshStates, true);
            }
          }
        }
      }

      // Передаём текущую карту в метод для поиска ближайшей атакующей карты
      const attackCard = this.getClosestUncoveredAttackCard(card);
      if (!attackCard) {
        console.log('No uncovered attack card found.');
        EventService.Instance.emit(EventType.RefreshStates, true);
        return;
      }

      // Обновляем соответствующий turn для preview
      if(Validator.IsCanDefend(attackCard, card)) {

        const defendCard = { rank: card.rank, suit: card.suit };
        const turnToUpdate = this.previewTableCards.find(turn =>
          turn.attackCard.rank === attackCard.rank && turn.attackCard.suit === attackCard.suit
        );

        if (turnToUpdate) {
          turnToUpdate.defendCard = defendCard;
        }

        // Обновляем стол с предварительным просмотром
        await this.updateTableCards(this.previewTableCards, true,  false);
        EventService.Instance.emit(EventType.PreviewHandCards, card);

        const currentState = PlayerSettingsStorage.playerState;
        if(currentState === 'take' && Validator.IsDefendComplete(this.previewTableCards))
        {
          EventService.Instance.emit(EventType.HideMyTimer, undefined);
          EventService.Instance.emit(EventType.UpdateAvailableState, "");
        }

        // Отправить запрос DefendRequest на сервер
        const defendRequest = new DefendRequest(
            new CardServerInfo(PlayerSettingsStorage.getCardOwner(CardUtils.getCardCode(attackCard)) || "undefined", CardUtils.getCardCode(attackCard)),
            new CardServerInfo(PlayerSettingsStorage.playerId, cardCode)
        );
        NetworkManager.send(defendRequest);
      }
      else {
        EventService.Instance.emit(EventType.RefreshStates, true);
      }
    } else {
      // console.warn(`Unknown player state: ${currentState}`);
      EventService.Instance.emit(EventType.RefreshStates, true);
    }
  }
  

  /**
 * Возвращает ближайшую атакующую карту без защиты относительно переданной карты
 * @param referenceCard Карта, относительно которой ищется ближайшая атакующая карта
 */
  private getClosestUncoveredAttackCard(referenceCard: CardUtils.Card): CardUtils.Card | undefined {
    const cardsManagerRef = CardsManagerRef.get();

    const uncoveredAttackCards = this.cachedTableCards.filter(turn => turn.defendCard === undefined);

    if (uncoveredAttackCards.length === 0) return undefined;

    // Получаем позицию referenceCard
    const referencePosition = cardsManagerRef.value.getCardPosition(referenceCard.rank, referenceCard.suit);
    if (!referencePosition) {
      console.warn('Reference card position is undefined.');
      return undefined;
    }

    // Находим ближайшую атакующую карту
    let closestCard: CardUtils.Card | undefined = undefined;
    let minDistance = Infinity;

    for (const turn of uncoveredAttackCards) {
      const attackCardPosition = cardsManagerRef.value.getCardPosition(turn.attackCard.rank, turn.attackCard.suit);
      if (!attackCardPosition) {
        console.warn(`Position for attack card ${CardUtils.getCardCode(turn.attackCard)} is undefined.`);
        continue;
      }

      // Вычисляем расстояние между referencePosition и attackCardPosition
      const distance = Math.hypot(
        referencePosition.x - attackCardPosition.x,
        referencePosition.y - attackCardPosition.y
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestCard = turn.attackCard;
      }
    }

    return closestCard;
  }

  private isTransferIconClosest(card: CardUtils.Card): boolean {
    if (!this.transferIconPosition) return false;
    const cardsManagerRef = CardsManagerRef.get();

    const position = cardsManagerRef.value.getCardPosition(card.rank, card.suit);

    if(!position) return false;

    const distanceToIcon = Math.hypot(
      position.x - this.transferIconPosition.x,
      position.y - this.transferIconPosition.y
    );
    
    const closestCard = this.getClosestUncoveredAttackCard(card);
    if (!closestCard) return true;

    const cardPosition = cardsManagerRef.value.getCardPosition(closestCard.rank, closestCard.suit);
    if (!cardPosition) return true;

    const distanceToCard = Math.hypot(
      position.x - cardPosition.x,
      position.y - cardPosition.y
    );

    return distanceToIcon < distanceToCard;
  }

  /**
   * Обновление карт на столе
   */
  private async updateTableCards(turns: CardUtils.TableTurn[], animate: boolean = true, fromServer: boolean = true): Promise<void> {
    if (fromServer) this.lastTableUpdate = Date.now();

    const cardsManagerRef = CardsManagerRef.get();

    // Копия предыдущего состояния для последующей очистки
    const previousTurns = this.cachedTableCards ? this.cachedTableCards.map(t => ({ ...t })) : [];

    // Кэшируем новое состояние (копия), не уничтожаем сразу
    const newTurns = turns.map(turn => ({ ...turn }));
    this.cachedTableCards = newTurns;

    turns = newTurns.map(turn => ({ ...turn }));

    const currentState = PlayerSettingsStorage.playerState;
    const gameType = PlayerSettingsStorage.gameType;
    const canTransfer: boolean = turns.length > 0 && turns.every(turn => !turn.defendCard);
    if (currentState == "defend" && gameType == 1 && canTransfer) {
      const fakeTableTurn = new class implements CardUtils.TableTurn {
        attackCard: CardUtils.Card;
        defendCard: CardUtils.Card;
      };

      const fakeCard = new class implements CardUtils.Card {
        rank: CardUtils.Rank;
        suit: CardUtils.Suit;
      };

      fakeCard.rank = CardUtils.Rank.Unknown;
      fakeCard.suit = CardUtils.Suit.Unknown;

      fakeTableTurn.attackCard = fakeCard;
      fakeTableTurn.defendCard = fakeCard;

      turns.push(fakeTableTurn);
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const maxCardsInRow = 3;
    const rowSpacingY = window.innerHeight / 100 * 15;
    const cardSpacingX = window.innerHeight / 100 * 11;
    const defendCardXOffset = 10;
    const defendCardYOffset = 10;
    const defendCardRotation = 10;
    const cardScale = 0.55;

    const rows = Math.ceil(turns.length / maxCardsInRow);
    EventService.Instance.emit(EventType.TransferIconShow, { isVisible: false, posX: 0, posY: 0 });

    for (let row = 0; row < rows; row++) {
      const rowStartIndex = row * maxCardsInRow;
      const rowEndIndex = Math.min(rowStartIndex + maxCardsInRow, turns.length);
      const cardsInRow = rowEndIndex - rowStartIndex;

      for (let i = rowStartIndex; i < rowEndIndex; i++) {
        const turn = turns[i];
        const cardIndexInRow = i - rowStartIndex;
        const baseX = centerX - (cardsInRow - 1) * cardSpacingX / 2 + cardIndexInRow * cardSpacingX;
        const baseY = centerY - (rows - 1) * rowSpacingY / 2 + row * rowSpacingY;
        let coord = { x: baseX, y: baseY };

        if (turn.attackCard.rank == CardUtils.Rank.Unknown) {
          this.transferIconPosition = { x: baseX, y: baseY };
          EventService.Instance.emit(EventType.TransferIconShow, { isVisible: true, posX: baseX, posY: baseY });
          continue;
        }

        if (!cardsManagerRef.value.isCardExist(turn.attackCard.rank, turn.attackCard.suit)) {
          const playerId = PlayerSettingsStorage.getCardOwner(CardUtils.getCardCode(turn.attackCard));
          if (playerId !== null) {
            const newCoord = PlayerSettingsStorage.getPlayerCoordinate(playerId);
            if (newCoord !== null) coord = newCoord;
          }

          await cardsManagerRef.value.spawnCard(
              turn.attackCard.rank,
              turn.attackCard.suit,
              'ton_default',
              coord.x,
              coord.y,
              0,
              0.3,
              i,
              false
          );
        }

        const attackCardInstance = cardsManagerRef.value.getCard(turn.attackCard.rank, turn.attackCard.suit);
        if (attackCardInstance && attackCardInstance.location != CardUtils.Location.Draft) {
          attackCardInstance.setLocation(CardUtils.Location.Table);
          if (animate)
            attackCardInstance.moveTo(baseX, baseY, 0, cardScale, 0.5, false, i, false);
          else attackCardInstance.set(baseX, baseY, 0, cardScale, false, i, false);
        }

        if (turn.defendCard) {
          const defendX = baseX + defendCardXOffset;
          const defendY = baseY + defendCardYOffset;
          let coord = { x: defendX, y: defendY };
          if (!cardsManagerRef.value.isCardExist(turn.defendCard.rank, turn.defendCard.suit)) {
            const playerId = PlayerSettingsStorage.getCardOwner(CardUtils.getCardCode(turn.defendCard));
            if (playerId !== null) {
              const newCoord = PlayerSettingsStorage.getPlayerCoordinate(playerId);
              if (newCoord !== null) coord = newCoord;
            }

            await cardsManagerRef.value.spawnCard(
                turn.defendCard.rank,
                turn.defendCard.suit,
                'ton_default',
                coord.x,
                coord.y,
                defendCardRotation,
                0.3,
                i + 1,
                false
            );
          }

          const defendCardInstance = cardsManagerRef.value.getCard(turn.defendCard.rank, turn.defendCard.suit);
          if (defendCardInstance && defendCardInstance.location != CardUtils.Location.Draft) {
            defendCardInstance.setLocation(CardUtils.Location.Table);
            if (animate)
              defendCardInstance.moveTo(defendX, defendY, defendCardRotation, cardScale, 0.5, false, i + 1, false);
            else defendCardInstance.set(defendX, defendY, defendCardRotation, cardScale, false, i + 1, false);
          }
        }
      }
    }

    // Отложенная очистка потерянных карт через 50 мс
    setTimeout(() => {
      const newKeys = new Set(newTurns.map(t =>
          CardUtils.getCardCode(t.attackCard) + (t.defendCard ? '_' + CardUtils.getCardCode(t.defendCard) : '')
      ));

      previousTurns.forEach(prev => {
        const keyAttack = CardUtils.getCardCode(prev.attackCard);
        const keyDefend = prev.defendCard ? CardUtils.getCardCode(prev.defendCard) : null;
        const comboKey = keyAttack + (keyDefend ? '_' + keyDefend : '');
        if (!newKeys.has(comboKey)) {
          cardsManagerRef.value.destroyCard(prev.attackCard.rank, prev.attackCard.suit);
          if (prev.defendCard) cardsManagerRef.value.destroyCard(prev.defendCard.rank, prev.defendCard.suit);
        }
      });
    }, 50);
  }

  /**
   * Восстановление состояния карт на столе
   */
  private async restoreTableCards(animate: boolean): Promise<void> {
    if (this.cachedTableCards.length === 0) return;
    await this.updateTableCards(this.cachedTableCards, animate, false);
  }

  /**
   * Удаление карт
   */
  public clear(): void {
    EventService.Instance.emit(EventType.TransferIconShow, { isVisible: false, posX: 0, posY: 0 });

    this.clearAllData();

    const cardsManagerRef = CardsManagerRef.get();
    const duration = 0.5;
    const xBase = window.innerWidth + 75;
    const yBase = window.innerHeight / 2;

    for (const table of this.cachedTableCards) {
      cardsManagerRef.value?.moveCardTo(table.attackCard.rank, table.attackCard.suit, xBase, yBase, 0, 1, duration);
      if (table.defendCard) {
        cardsManagerRef.value?.moveCardTo(table.defendCard.rank, table.defendCard.suit, xBase, yBase, 0, 1, duration);
      }

      setTimeout(() => {
        cardsManagerRef.value?.destroyCard(table.attackCard.rank, table.attackCard.suit);
        if (table.defendCard) {
          cardsManagerRef.value?.destroyCard(table.defendCard.rank, table.defendCard.suit);
        }
      }, duration * 1000);
    }

    setTimeout(() => {
      this.cachedTableCards = [];
    }, duration * 1000);
  }

  /**
   * Отписка от событий и очистка ресурсов
   */
  public destroy(): void {
    console.log("Destroying TableController");

    //this.clear();

    EventService.Instance.off(EventType.TableCardsChanged, "TableController: updateTableCards");
    EventService.Instance.off(EventType.RefreshStates, "TableController: restoreTableCards");
    EventService.Instance.off(EventType.TryAttackOrDefend, "TableController: handleTryAttackOrDefend");
    EventService.Instance.off(EventType.GameEnded, "TableController: clear");
    EventService.Instance.off(EventType.PlayerStatesChanged, "TableController: updatePlayerStates");
    EventService.Instance.off(EventType.CardAmountsChanged, "TableController: updateCardAmounts");
  }
}

export default TableController;
