import { CardUtils } from './CardUtils';

export class Validator {
    private static trumpSuit: CardUtils.Suit = CardUtils.Suit.Unknown;
    private static isBatComplete: boolean = false;

    public static SetTrumpCard(card: CardUtils.Card) {
        this.trumpSuit = card.suit;
    }

    public static SetBatComplete(isComplete: boolean)
    {
        this.isBatComplete = isComplete;
    }

    public static IsCanAttack(table: CardUtils.TableTurn[], attackCard: CardUtils.Card, cardsCount: number | null): boolean {

        const maxCardsOnTable = this.isBatComplete ? 6 : 5;
        if (table.length >= maxCardsOnTable) return false; // Нельзя атаковать, если на столе уже 6 пар карт

        const uncoveredCards = table.filter(turn => !turn.defendCard).length;
        if (cardsCount !== null && cardsCount < uncoveredCards + 1) return false; // Нельзя атаковать, если карт у игрока меньше, чем непокрытые + атакующая карта

        return table.length === 0 || table.some(turn => turn.attackCard.rank === attackCard.rank || turn.defendCard?.rank === attackCard.rank);
    }

    public static IsCanDefend(attackCard: CardUtils.Card, defendCard: CardUtils.Card): boolean {
        if (defendCard.suit === attackCard.suit) {
            return defendCard.rank > attackCard.rank;
        }

        return defendCard.suit === this.trumpSuit && attackCard.suit !== this.trumpSuit;
    }

    public static IsCanTransfer(table: CardUtils.TableTurn[], transferCard: CardUtils.Card): boolean {
        if (table.length === 0) return false; // Нельзя переводить, если нет атакующих карт
        if (table.some(turn => turn.defendCard)) return false; // Нельзя переводить, если есть защитные карты

        return table.every(turn => turn.attackCard.rank === transferCard.rank);
    }

    public static IsDefendComplete(table: CardUtils.TableTurn[]): boolean {
        return table.every(turn => turn.defendCard)
    }
}
