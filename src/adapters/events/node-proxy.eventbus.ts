import { ProxyEntity } from '../../domain/entities/proxy.entity.js';
import { ProxyEventBus } from '../../domain/events/proxy.events.js';
import { ProxiesEmitter } from '../../infrastructure/events/proxies.emitter.js';

export class NodeProxyEventBus implements ProxyEventBus {
  emitNewProxy(proxy: ProxyEntity): void {
    ProxiesEmitter.emitter.emit(ProxiesEmitter.Events.NEW_PROXY, proxy);
  }

  emitUpdatedProxy(proxy: ProxyEntity): void {
    ProxiesEmitter.emitter.emit(ProxiesEmitter.Events.UPDATED_PROXY, proxy);
  }

  emitDeletedProxy(proxy: ProxyEntity): void {
    ProxiesEmitter.emitter.emit(ProxiesEmitter.Events.DELETED_PROXY, proxy);
  }
}
