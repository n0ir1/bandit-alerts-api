export class Alert {
    id?: string;
    userId?: string;
    donatorId?: string;
    amount?: number;
    text?: string;
    createdAt?: string;
}

export abstract class IMutation {
    abstract donationAlertsSend(userId: string, donatorId: string, amount: number, text: string): boolean | Promise<boolean>;

    abstract signup(username: string, password: string): Tokens | Promise<Tokens>;

    abstract logout(): boolean | Promise<boolean>;
}

export abstract class IQuery {
    abstract alerts(): Alert[] | Promise<Alert[]>;

    abstract login(username: string, password: string): Tokens | Promise<Tokens>;

    abstract tokens(refreshToken: string): Tokens | Promise<Tokens>;

    abstract user(id?: string, name?: string): User | Promise<User>;

    abstract temp__(): boolean | Promise<boolean>;
}

export abstract class ISubscription {
    abstract newDonationAlert(id: string): Alert | Promise<Alert>;
}

export class Tokens {
    accessToken?: string;
    refreshToken?: string;
}

export class User {
    userId?: string;
    username?: string;
}
