export class Localizator {
    private static translations: Record<string, Record<string, string>> = {
        'ru': {
            'take': 'взял',
            'pass': 'пас',
            'ready': 'готов',
            'bat': 'бито',
            'winner': 'победа',
            'durak': 'дурак',
            'attack': 'атака',
            'defend': 'защита',
            'take_button' : "взять",
            'pass_button': 'пас',
            'ready_button': 'готов',
            'bat_button': 'бито',
        },
    };

    public static GetLocalization(text: string, language_code: string = "ru"): string {
        const languageTranslations = this.translations[language_code];
        if (languageTranslations && languageTranslations[text]) {
            return languageTranslations[text];
        }
        return this.translations['ru'][text] || text; // по умолчанию вернуть английский перевод
    }
}
