import { TCPClient, EventFactory } from 'geteventstore-promise';

/**
 * @class EventStore
 * @description EventStore.org
 */
export class EventStore {
  type: string;
  eventFactory: EventFactory;
  client: TCPClient;
  [x: string]: any;

  /**
   * @constructor
   */
  constructor() {
    this.type = 'event-store';
    this.eventFactory = new EventFactory();
  }

  connect(config) {
    this.client = new TCPClient(config);
    return this;
  }

  getClient() {
    return this.client;
  }

  newEvent(name, payload) {
    return this.eventFactory.newEvent(name, payload, {}, undefined);
  }

  close() {
    this.client.close();
    return this;
  }
}
