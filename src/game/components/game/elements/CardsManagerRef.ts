// CardsManagerRef.ts
import type CardsManager from './CardsManager.vue';

export class CardsManagerRef {
  // Храним ссылку в статическом поле
  private static cardsManagerRef: { value: InstanceType<typeof CardsManager> | null };
  
  // Устанавливаем
  public static set(value: { value: InstanceType<typeof CardsManager> | null }) {
    console.log("Setting CardsManagerRef");
    CardsManagerRef.cardsManagerRef = value;
  }

  // Получаем
  public static get():{ value: InstanceType<typeof CardsManager> | null } {
    if (CardsManagerRef.cardsManagerRef == null)
      console.error("CardsManager reference not available.")

    return CardsManagerRef.cardsManagerRef;
  }

  // Чистим
  public static clear(){
    console.log("Clearing CardsManagerRef");
    CardsManagerRef.cardsManagerRef = null;
  }
}
