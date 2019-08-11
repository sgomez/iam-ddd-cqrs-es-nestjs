import { Injectable } from '@nestjs/common';
import { IEventPublisher } from '@nestjs/cqrs/dist/interfaces/events/event-publisher.interface';
import { IEvent } from '@nestjs/cqrs/dist/interfaces/events/event.interface';
import { IMessageSource } from '@nestjs/cqrs/dist/interfaces/events/message-source.interface';
import { TCPClient } from 'geteventstore-promise';
import * as http from 'http';
import { Subject } from 'rxjs';
import * as xml2js from 'xml2js';

import { config } from '../../../config';
import { Scope } from '../../scope/domain/model/Scope';

const eventStoreHostUrl =
  config.EVENT_STORE_SETTINGS.protocol +
  `://${config.EVENT_STORE_SETTINGS.hostname}:${
    config.EVENT_STORE_SETTINGS.httpPort
  }/streams/`;

class InstanceLoader {
  static getInstance<T>(context: Object, name: string, ...args: any[]): T {
    var instance = Object.create(context[name].prototype);
    instance.constructor.apply(instance, args);
    return <T>instance;
  }
}
/**
 * @class EventStore
 * @description The EventStore.org bridge. By design, the domain category
 * (i.e. user) events are being subscribed to. Upon events being received,
 * internal event handlers are responsible for the handling of events.
 */
@Injectable()
export class EventStore implements IEventPublisher, IMessageSource {
  private eventStore: any;
  private eventHandlers: object;
  private category: string;
  private client: TCPClient;

  constructor() {
    this.category = 'iam';
    this.client = new TCPClient({
      hostname: config.EVENT_STORE_SETTINGS.hostname,
      port: config.EVENT_STORE_SETTINGS.tcpPort,
      credentials: config.EVENT_STORE_SETTINGS.credentials,
      poolOptions: config.EVENT_STORE_SETTINGS.poolOptions,
    });
  }

  async publish<T extends IEvent>(event: T) {
    const message = JSON.parse(JSON.stringify(event));
    const id = message.id.props.value;
    const streamName = `${this.category}-${id}`;
    const type = event.constructor.name;
    const metadata = {
      _aggregate_id: id,
      _ocurred_on: new Date().getTime(),
    };

    try {
      await this.client.writeEvent(streamName, type, event, metadata);
    } catch (err) {
      console.trace(err);
    }
  }

  async read(object: any, id: string): Promise<Scope> | null {
    const streamName = `${this.category}-${id}`;

    try {
      const scope = new Scope();

      const response = await this.client.getEvents(streamName);

      const events = response.map(event => {
        const eventType = event.eventType;
        const data = event.data;

        return this.eventHandlers[eventType](...Object.values(data));
      });

      if (events.length === 0) {
        return null;
      }

      scope.loadFromHistory(events);

      return scope;
    } catch (err) {
      console.trace(err);
    }

    return null;
  }

  /**
   * @description Event Store bridge subscribes to domain category stream
   * @param subject
   */
  async bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {
    const streamName = `$ce-${this.category}`;

    const onEvent = async event => {
      const eventUrl =
        eventStoreHostUrl + `${event.metadata.$o}/${event.data.split('@')[0]}`;
      http.get(eventUrl, res => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', chunk => {
          rawData += chunk;
        });
        res.on('end', () => {
          xml2js.parseString(rawData, (err, result) => {
            if (err) {
              console.trace(err);
              return;
            }
            const content = result['atom:entry']['atom:content'][0];
            const eventType = content.eventType[0];
            const data = content.data[0];
            event = this.eventHandlers[eventType](...Object.values(data));
            subject.next(event);
          });
        });
      });
    };

    const onDropped = (subscription, reason, error) => {
      console.trace(subscription, reason, error);
    };

    try {
      await this.client.subscribeToStream(
        streamName,
        onEvent,
        onDropped,
        false,
      );
    } catch (err) {
      console.trace(err);
    }
  }

  setEventHandlers(eventHandlers) {
    this.eventHandlers = eventHandlers;
  }
}
