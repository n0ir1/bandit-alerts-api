export class DonationAlert {
    id?: string;
    username?: string;
    amount?: number;
    text?: string;
}

export abstract class IMutation {
    abstract donationAlertsSend(id: string, username?: string, amount?: number, text?: string): DonationAlert | Promise<DonationAlert>;
}

export abstract class IQuery {
    abstract temp__(): boolean | Promise<boolean>;
}

export abstract class ISubscription {
    abstract newDonationAlert(id: string): DonationAlert | Promise<DonationAlert>;
}
