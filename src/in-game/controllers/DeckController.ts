import { EventService, EventType } from '../network/EventService.ts';
import { CardUtils } from '../utils/CardUtils.ts';
import { CardsManagerRef } from '../components/CardsManagerRef.ts';

export default class DeckController {
  static Instance: DeckController | null = null;

  private deckCardIds: string[] = [];
  private trumpCard: CardUtils.Card | null = null;

  constructor() {
    if (!DeckController.Instance) {
      DeckController.Instance = this;
    }

    EventService.Instance.on(EventType.DeckCardAmountChanged, "DeckController: onCardAmountSet", this.onCardAmountSet.bind(this));
    EventService.Instance.on(EventType.TrumpSet, "DeckController: onTrumpSet", this.onTrumpSet.bind(this));
    EventService.Instance.on(EventType.RefreshStates, "DeckController: onRefreshStates", this.onRefreshStates.bind(this));
    EventService.Instance.on(EventType.GameEnded, "DeckController: clear", this.clear.bind(this));
  }

  private onRefreshStates(){
    this.updateDeckPositions(false);
  }

  private async onCardAmountSet(count: number) {
    const cardsManagerRef = CardsManagerRef.get();

    const currentCount = this.deckCardIds.length;
    const diff = count - currentCount;
    const yPos = window.innerHeight / 2 - 100;
    
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        const cardCmp = await cardsManagerRef.value.spawnCard(
          CardUtils.Rank.Unknown,
          CardUtils.Suit.Unknown,
          'ton_default',
          -200,
          yPos,
          0,
          0.5,
          999,
          true
        );

        if (cardCmp) {
          this.deckCardIds.push(cardCmp.$props.cardId);
        }
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        const topId = this.deckCardIds[0];
        if (topId) {
          cardsManagerRef.value.destroyCardById(topId);
          this.deckCardIds = this.deckCardIds.filter(x => x !== topId);
        }
      }
    }

    this.updateDeckPositions();
  }

  private onTrumpSet(trumpCard: CardUtils.Card) {
    this.trumpCard = trumpCard;
    this.updateDeckPositions();
  }

  private updateDeckPositions(animate: boolean = true) {
    const cardsManagerRef = CardsManagerRef.get();

    const xPos = -10;
    const yPos = window.innerHeight / 100 * 39;

    for (let i = 0; i < this.deckCardIds.length; i++) {
      const cardId = this.deckCardIds[i];
      const isTrump = i === this.deckCardIds.length - 1 && this.trumpCard;
      const rot = isTrump ? 105 : i + 10;
      const zIndex = isTrump ? 1 : 1000 - i;
      const dur = 0.3 + this.deckCardIds.length * 0.1 - i * 0.03;
      const xOffset = isTrump ? 15 : xPos;
      const yOffset = isTrump ? yPos + 7 : yPos;

      const cardCmp = cardsManagerRef.value.getCardById(cardId);
      if (cardCmp) {
        if (isTrump) {
          cardCmp.setAppearance(this.trumpCard!.rank, this.trumpCard!.suit);
          if(animate) {
            cardsManagerRef.value.moveCardToById(
                cardId,
                xOffset,
                yOffset,
                105,
                0.5,
                dur,
                false,
                zIndex,
                false
            );
          } else {
            cardsManagerRef.value.setCardById(
                cardId,
                xOffset,
                yOffset,
                105,
                0.5,
                false,
                zIndex,
                false
            );
          }
          
        } else {
          cardCmp.setAppearance(CardUtils.Rank.Unknown, CardUtils.Suit.Unknown);
          if(animate) {
            cardsManagerRef.value.moveCardToById(
              cardId,
              xOffset,
              yOffset,
              rot,
              0.5,
              dur,
              false,
              zIndex,
              true
            );
          } else {
            cardsManagerRef.value.setCardById(
                cardId,
                xOffset,
                yOffset,
                rot,
                0.5,
                false,
                zIndex,
                true
            );
          }
          }
        }
      }
  }

  /*getTopCardId(): string {
    if (!this.cardsManagerRef.value || this.deckCardIds.length === 0) return;

    const cardId = this.deckCardIds.pop();
    this.deckCardIds = this.deckCardIds.filter(x => x !== cardId);

    return cardId;
  }*/

  clear() {
    const cardsManagerRef = CardsManagerRef.get();

    for (const id of this.deckCardIds) {
      try {
        if (!id) {
          console.log(`Clear DeckController: Skipping invalid id: ${id}`);
          continue;  // Пропускаем пустые или неверные id
        }

        if (!cardsManagerRef.value) {
          console.error("Clear DeckController: cardsManagerRef is undefined or null");
          break;  // Прерываем выполнение, если cardsManagerRef не существует
        }

        cardsManagerRef.value.destroyCardById(id);
      } catch (error) {
        console.error(`Clear DeckController: Error while destroying card with id: ${id}`, error);
      }
    }

    this.deckCardIds = [];
    this.trumpCard = null;
  }

  destroy() {
    //this.clear();
    EventService.Instance.off(EventType.DeckCardAmountChanged, "DeckController: onCardAmountSet");
    EventService.Instance.off(EventType.TrumpSet, "DeckController: onTrumpSet");
    EventService.Instance.off(EventType.RefreshStates, "DeckController: onRefreshStates");
    EventService.Instance.off(EventType.GameEnded, "DeckController: clear");
  }
}
