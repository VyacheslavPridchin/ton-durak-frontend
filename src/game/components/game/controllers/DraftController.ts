import { EventService, EventType } from '../../../network/EventService';
import { CardUtils } from '../../../utils/CardUtils';
import { CardsManagerRef } from "../elements/CardsManagerRef.ts";
import {Validator} from "../../../utils/Validator.ts";

export default class DraftController {
  private draftCardIds: Set<string> = new Set();

  constructor() {
    EventService.Instance.on(EventType.CardsMovedToDiscard, "DraftController: handleCardsMovedToDiscard", this.handleCardsMovedToDiscard.bind(this));
    EventService.Instance.on(EventType.GameEnded, "DraftController: clear", this.clear.bind(this));
  }

  private handleCardsMovedToDiscard(cards: CardUtils.Card[]) 
  {
    Validator.SetBatComplete(true);
    const cardsManagerRef = CardsManagerRef.get();

    cards.forEach((cardData) => {
      // Ищем карту по rank/suit
      const cardCmp = cardsManagerRef.value.getCard(cardData.rank, cardData.suit);
      if (!cardCmp) {
        console.warn(`Card ${cardData.rank}-${cardData.suit} not found.`);
        return;
      }

      const xBase = window.innerWidth + 10;
      const yBase = window.innerHeight / 2 - 50;
  
      cardCmp.moveTo(
          xBase + (Math.random() * 30 - 15),
          yBase + (Math.random() * 120 - 60),
          90 + (Math.random() * 100 - 50),
          0.4,
          0.4,
          false,
          0,
          true
        );


      //cardCmp.moveTo(window.innerWidth + 200, window.innerHeight / 2 - 100, 0, 0.5, 0.4, false, 0, false);
      this.draftCardIds.add(cardCmp.$props.cardId);
      cardCmp.setAppearance(CardUtils.Rank.Unknown, CardUtils.Suit.Unknown, true);
      cardCmp.setLocation(CardUtils.Location.Draft);
      //setTimeout(() => {
      //  //this.cardsManagerRef?.value?.destroyCard(cardData.rank, cardData.suit);
      //}, 100);
    });
  }

  public getCount(): number {
    return this.draftCardIds.size;
  }

  public clear(): void {
    const cardsManagerRef = CardsManagerRef.get();
    const duration = 0.5;
    const xBase = window.innerWidth + 75;
    const yBase = window.innerHeight / 2;

    for (const id of this.draftCardIds) {
      cardsManagerRef.value?.moveCardToById(id, xBase, yBase, 0, 1, duration);
      setTimeout(() => {
        cardsManagerRef.value?.destroyCardById(id);
      }, duration * 1000);
    }

    setTimeout(() => {
      this.draftCardIds.clear();
    }, duration * 1000);
  }

  public destroy() : void {
    console.log("Destroying DraftController");
    //this.clear();

    EventService.Instance.off(EventType.CardsMovedToDiscard, "DraftController: handleCardsMovedToDiscard");
    EventService.Instance.off(EventType.GameEnded, "DraftController: clear");
  }
}
