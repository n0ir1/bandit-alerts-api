export class Alert {
    id?: string;
    username?: string;
    amount?: number;
    text?: string;
}

export abstract class IMutation {
    abstract donationAlertsSend(id: string, username: string, amount: number, text: string): Alert | Promise<Alert>;

    abstract signup(username: string, password: string): Token | Promise<Token>;
}

export abstract class IQuery {
    abstract alerts(): Alert[] | Promise<Alert[]>;

    abstract login(username: string, password: string): Token | Promise<Token>;

    abstract user(id?: string): User | Promise<User>;

    abstract temp__(): boolean | Promise<boolean>;
}

export abstract class ISubscription {
    abstract newDonationAlert(id: string): Alert | Promise<Alert>;
}

export class Token {
    token?: string;
}

export class User {
    id?: string;
    username?: string;
}
