/**
 * Аналог C# RequestPackets, 
 * здесь классы сериализуемые через JSON для отправки на сервер.
 */

export abstract class BaseRequest {
    public getJSON(): string {
      return JSON.stringify(this);
    }
  }
  
  export class JoinRequest extends BaseRequest {
    public lobby_id: string;
    public player_id: string;
  
    // Если нужно поле type = "join", можно добавить
    public type = "join";
  
    constructor(lobbyId: string, playerId: string) {
      super();
      this.lobby_id = lobbyId;
      this.player_id = playerId;
    }
  }

export class PingRequest extends BaseRequest {
  public type = "ping";
  constructor() {
    super();
  }
}

export class EmoteRequest extends BaseRequest {
  public type = "emote";
  public emote: string;

  constructor(emote: string) {
    super();
    this.emote = emote;
  }
}

// export class GetRequest extends BaseRequest {
//   public type = "request";
//   public request: string;
//   constructor(request: string) {
//     super();
//     this.request = request;
//   }
// }

export class GetBetsRequest extends BaseRequest {
  public type = "request";
  public request = "bets";
}

export class ChangeBetRequest extends BaseRequest {
  public type = "change_bet";
  public value: number;
  constructor(value: number) {
    super();
    this.value = value;
  }
}

export class SurrenderRequest extends BaseRequest {
  public type = "surrender";
}

export class AcceptBetRequest extends BaseRequest {
  public type = "accept";
  public value: number;
  constructor(value: number) {
    super();
    this.value = value;
  }
}

export class DeclineBetRequest extends BaseRequest {
  public type = "decline";
  public value: number;
  constructor(value: number) {
    super();
    this.value = value;
  }
}

export class MuteRequest extends BaseRequest {
  public type = "mute";
  public player: string;

  constructor(player: string) {
    super();
    this.player = player;
  }
}

export class UnmuteRequest extends BaseRequest {
  public type = "unmute";
  public player: string;

  constructor(player: string) {
    super();
    this.player = player;
  }
}


  export class LeaveRequest extends BaseRequest {
    public type = "leave";
    constructor() {
      super();
    }
  }
  
  export class ChangeStateRequest extends BaseRequest {
    public type = "state";
    public state: string;
  
    constructor(state: string) {
      super();
      this.state = state;
    }
  }
  
  export class AttackRequest extends BaseRequest {
    public type = "attack";
    public move: string;
  
    constructor(cardCode: string) {
      super();
      this.move = cardCode;
    }
  }
  
  export class DefendRequest extends BaseRequest {
    public type = "defend";
    public move: string[][];
  
    constructor(attackCard: CardServerInfo, defendCard: CardServerInfo) {
      super();
      this.move = [
        [attackCard.PlayerId, attackCard.Card],
        [defendCard.PlayerId, defendCard.Card],
      ];
    }
  }
  
  export class CardServerInfo {
    public PlayerId: string;
    public Card: string;
  
    constructor(playerId: string, card: string) {
      this.PlayerId = playerId;
      this.Card = card;
    }
  }
  