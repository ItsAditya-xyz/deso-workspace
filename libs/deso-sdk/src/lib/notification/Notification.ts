import {
  GetNotificationsCountRequest,
  GetNotificationsCountResponse,
  GetNotificationsRequest,
  GetNotificationsResponse,
  SetNotificationMetadataRequest,
} from '@deso-workspace/deso-types';
import axios from 'axios';
import { Node } from '../../index';
import { Identity } from '../identity/Identity';
// remove this later and figure out a better solution for the this binding issue
let Notifications: Notification;
export class Notification {
  node: Node;
  identity: Identity;
  constructor(node: Node, identity: Identity) {
    this.node = node;
    this.identity = identity;
    Notifications = this;
  }

  public async getNotifications(
    request: Partial<GetNotificationsRequest>
  ): Promise<GetNotificationsResponse> {
    const endpoint = 'get-notifications';
    return await axios.post(`${this.node.getUri()}/${endpoint}`, request);
  }

  public async getUnreadNotificationsCount(
    request: Partial<GetNotificationsCountRequest>
  ): Promise<GetNotificationsCountResponse> {
    const endpoint = 'get-unread-notifications-count';
    return await axios.post(`${this.node.getUri()}/${endpoint}`, request);
  }

  public async setNotificationMetadata(
    request: Partial<SetNotificationMetadataRequest>
  ): Promise<void> {
    const jwt = await this.identity.getJwt();
    const unread = await Notifications.getUnreadNotificationsCount({
      PublicKeyBase58Check: request.PublicKeyBase58Check,
    });
    request.LastSeenIndex = unread.LastUnreadNotificationIndex;
    request.UnreadNotifications = 0;
    request.JWT = jwt;
    const endpoint = 'set-notification-metadata';
    return await axios.post(`${this.node.getUri()}/${endpoint}`, request);
  }
}
