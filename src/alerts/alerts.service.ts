import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertsService {
  private readonly alerts = [
    { id: 1, username: 'Test', amount: 5, text: 'tertr' },
    { id: 2, username: 'Test2', amount: 4, text: 'ajskajk' },
  ];

  create(alerts) {
    this.alerts.push(alerts);
    return alerts;
  }

  findAll() {
    return this.alerts;
  }

  findOneById(id) {
    return this.alerts.find(alert => alert.id == id);
  }
}
