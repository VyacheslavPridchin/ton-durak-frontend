import { EventService, EventType } from '../../../network/EventService';
import { CardUtils } from '../../../utils/CardUtils';
import { CardsManagerRef } from '../elements/CardsManagerRef.ts';

class HandController {
  private cachedHandCards: CardUtils.Card[] = [];

  constructor() {
    EventService.Instance.on(EventType.HandCardsChanged, "HandController: updateHandCards", this.updateHandCards.bind(this));
    EventService.Instance.on(EventType.RefreshStates, "HandController: restoreHandCards", this.restoreHandCards.bind(this));
    EventService.Instance.on(EventType.GameEnded, "HandController: clear", this.clear.bind(this));
    EventService.Instance.on(EventType.PreviewHandCards, "HandController: previewHand", this.previewHand.bind(this));
  }

  private async previewHand(exceptCard: CardUtils.Card): Promise<void> {

    console.log("this.cachedHandCards", this.cachedHandCards);

    console.log("exceptCard", exceptCard);
    // Фильтруем кэшированные карты, исключая exceptCard
    const filteredCards = this.cachedHandCards.filter(card => !(card.rank == exceptCard.rank && card.suit == exceptCard.suit));
    console.log("filteredCards", filteredCards);
    // Вызываем updateHandCards с отфильтрованными картами
    await this.updateHandCards(filteredCards);
  }

  /**
   * Обновление карт в руке
   */
  private async updateHandCards(newCards: CardUtils.Card[], animate: boolean = true): Promise<void> {
    this.cachedHandCards = newCards;
    const cardsManagerRef = CardsManagerRef.get();
    const centerX = window.innerWidth / 2;
    const bottomY = window.innerHeight - 100; // Расположение чуть выше низа экрана
    const totalCards = newCards.length;

    const angle = 30; // Общий угол веера
    const halfAngle = angle / 2; // Половина угла веера
    let width = Math.min(300, totalCards * 50, window.innerWidth * 0.7);
    if (totalCards === 2) {
      width = 100;
    }
    const heightOffset = 20; // Смещение по высоте
    const height = 30; // Высота дуги

    for (let i = 0; i < totalCards; i++) {
      const angleStep = totalCards > 1 ? angle / (totalCards - 1) : 0;
      let currentAngle = -(halfAngle - i * angleStep);
      let xPos = centerX - width / 2 + (i * width) / (totalCards - 1);

      if (totalCards === 1) {
        currentAngle = 0;
        xPos = centerX;
      }

      if (totalCards === 2) {
        currentAngle = i === 0 ? -5 : 5;
      }

      const yPos =
        bottomY -
        (1 - Math.pow(Math.abs(currentAngle) / halfAngle, 2)) * height +
        heightOffset;

      const rotation = currentAngle;

      const xDeckPos = -30;
      const yDeckPos = window.innerHeight / 2 - 150;

      if(!cardsManagerRef.value.isCardExist(newCards[i].rank, newCards[i].suit)) {
        await cardsManagerRef.value.spawnCard(
            newCards[i].rank,
            newCards[i].suit,
            'ton_default',
            xDeckPos,
            yDeckPos,
            rotation,
            0.3,
            i,
            false
        );

        await new Promise(resolve => setTimeout(resolve, 50));
      }

      const cardInstance = cardsManagerRef.value.getCard(newCards[i].rank, newCards[i].suit);

      if (cardInstance) {
        cardInstance.setLocation(CardUtils.Location.Hand);
        if(animate)
            cardInstance.moveTo(xPos, yPos, rotation, 0.75, 0.5, true, i, false);
        else
            cardInstance.set(xPos, yPos, rotation, 0.75, true, i, false);

      } else {
        console.warn(`Card ${newCards[i].rank}-${newCards[i].suit} could not be moved.`);
      }
    }
  }

  /**
   * Восстановление состояния карт
   */
  private async restoreHandCards(animate: boolean): Promise<void> {
    if (this.cachedHandCards.length === 0) 
        return;

    await this.updateHandCards(this.cachedHandCards, animate);
  }

  public clear(): void {
    const cardsManagerRef = CardsManagerRef.get();
    const xBase = window.innerWidth + 75;
    const yBase = window.innerHeight / 2;
    const duration = 0.5;

    for (const card of this.cachedHandCards) {
      cardsManagerRef.value.moveCardTo(card.rank, card.suit, xBase, yBase, 0, 1, duration);
      setTimeout(() => {
        cardsManagerRef.value.destroyCard(card.rank, card.suit);
      }, duration * 1000);
    }

    setTimeout(() => {
      this.cachedHandCards = [];
    }, duration * 1000);
  }


  /**
   * Отписка от событий и очистка ресурсов
   */
  public destroy(): void {
    console.log("Destroying HandController");

    EventService.Instance.off(EventType.HandCardsChanged, "HandController: updateHandCards");
    EventService.Instance.off(EventType.RefreshStates, "HandController: restoreHandCards");
    EventService.Instance.off(EventType.GameEnded, "HandController: clear");
    EventService.Instance.off(EventType.PreviewHandCards, "HandController: previewHand");
  }
}

export default HandController;
