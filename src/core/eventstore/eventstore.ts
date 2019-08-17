import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { IEventPublisher } from '@nestjs/cqrs/dist/interfaces/events/event-publisher.interface';
import { IEvent } from '@nestjs/cqrs/dist/interfaces/events/event.interface';
import { IMessageSource } from '@nestjs/cqrs/dist/interfaces/events/message-source.interface';
import { TCPClient } from 'geteventstore-promise';
import * as http from 'http';
import { RequestOptions } from 'https';
import { Subject } from 'rxjs';

import { config } from '../../../config';

const eventStoreHostUrl =
  config.EVENT_STORE_SETTINGS.protocol +
  `://${config.EVENT_STORE_SETTINGS.hostname}:${
    config.EVENT_STORE_SETTINGS.httpPort
  }/streams/`;

/**
 * @class EventStore
 * @description The EventStore.org bridge. By design, the domain category
 * (i.e. user) events are being subscribed to. Upon events being received,
 * internal event handlers are responsible for the handling of events.
 */
@Injectable()
export class EventStore implements IEventPublisher, IMessageSource {
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
    if ('id' in event === false) {
      throw new Error('Not a DomainEvent');
    }

    const message = JSON.parse(JSON.stringify(event));
    const id = message.id;
    const streamName = `${this.category}-${id}`;
    const type = event.constructor.name;
    const metadata = {
      _aggregate_id: id,
      _ocurred_on: new Date().getTime(),
    };

    try {
      await this.client.writeEvent(streamName, type, event, metadata);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.trace(err);
    }
  }

  async read<T extends AggregateRoot>(T: any, id: string): Promise<T> | null {
    const streamName = `${this.category}-${id}`;

    try {
      const entity = new T();

      const response = await this.client.getEvents(streamName);

      const events = response.map(event => {
        const eventType = event.eventType;
        const data = event.data;

        return this.eventHandlers[eventType](...Object.values(data));
      });

      if (events.length === 0) {
        return null;
      }

      entity.loadFromHistory(events);

      return entity;
    } catch (err) {
      // tslint:disable-next-line:no-console
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

      const requestOptions: http.RequestOptions = {
        headers: {
          Accept: 'application/vnd.eventstore.atom+json',
        },
      };

      http.get(eventUrl, requestOptions, res => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', chunk => {
          rawData += chunk;
        });
        res.on('end', () => {
          const message = JSON.parse(rawData);

          const eventType = message.content.eventType;
          const data = message.content.data;
          event = this.eventHandlers[eventType](...Object.values(data));

          subject.next(event);
        });
      });
    };

    const onDropped = (subscription, reason, error) => {
      // tslint:disable-next-line:no-console
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
      // tslint:disable-next-line:no-console
      console.trace(err);
    }
  }

  setEventHandlers(eventHandlers) {
    this.eventHandlers = eventHandlers;
  }
}
