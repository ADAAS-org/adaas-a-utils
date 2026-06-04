import { __decorateClass, __decorateParam } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Feature, A_Inject, A_Component } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame/core';
import { A_ChannelFeatures, A_ChannelRequest } from '@adaas/a-utils/a-channel';
import { A_InspectorMessageType } from '../A-Inspector.constants';
import { A_InspectorError } from '../A-Inspector.error';
import { InspectorChannel } from './InspectorChannel';
import { InspectorClientConfig } from './InspectorClientConfig.fragment';

async function loadNet() {
  try {
    const req = eval('typeof require !== "undefined" ? require : undefined');
    if (req) return req("net");
  } catch {
  }
  return await Function('return import("net")')();
}
let InspectorChannelProcessor = class extends A_Component {
  async onConnect(channel, config) {
    const net = await loadNet();
    const { host, port, secret, timeout } = config;
    channel.authPromise = new Promise((resolve, reject) => {
      const socket = net.createConnection({ host, port }, () => {
        socket.write(JSON.stringify({
          type: A_InspectorMessageType.Auth,
          secret
        }) + "\n");
      });
      channel.socket = socket;
      socket.setEncoding("utf8");
      const authTimer = setTimeout(() => {
        socket.destroy();
        reject(new A_InspectorError({
          title: A_InspectorError.InspectorTransportError,
          description: `inspector auth handshake timed out after ${timeout}ms`
        }));
      }, timeout);
      socket.on("data", (chunk) => {
        channel.readBuffer += chunk;
        this.drainBuffer(channel, resolve, reject, authTimer);
      });
      socket.on("error", (err) => {
        clearTimeout(authTimer);
        const e = new A_InspectorError({
          title: A_InspectorError.InspectorTransportError,
          description: err?.message ?? String(err)
        });
        if (!channel.authed) reject(e);
        this.failAllPending(channel, e);
      });
      socket.on("close", () => {
        clearTimeout(authTimer);
        const e = new A_InspectorError({
          title: A_InspectorError.InspectorTransportError,
          description: "inspector socket closed unexpectedly"
        });
        if (!channel.authed) reject(e);
        this.failAllPending(channel, e);
      });
    });
    await channel.authPromise;
  }
  async onRequest(channel, config, request) {
    if (!channel.socket || !channel.authed) {
      throw new A_InspectorError({
        title: A_InspectorError.InspectorTransportError,
        description: "inspector channel is not connected"
      });
    }
    const { code, payload } = request.params;
    const id = `inspector-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const timeout = config.timeout;
    const resultPayload = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        channel.pending.delete(id);
        reject(new A_InspectorError({
          title: A_InspectorError.InspectorTransportError,
          description: `inspector command '${code}' timed out after ${timeout}ms`
        }));
      }, timeout);
      channel.pending.set(id, { id, resolve, reject, timer });
      const msg = {
        type: A_InspectorMessageType.Command,
        id,
        payload: { ...payload, code }
      };
      channel.socket.write(JSON.stringify(msg) + "\n");
    });
    request.succeed({ payload: resultPayload });
  }
  async onDisconnect(channel) {
    this.failAllPending(channel, new A_InspectorError({
      title: A_InspectorError.InspectorTransportError,
      description: "inspector channel disconnected"
    }));
    try {
      channel.socket?.end();
    } catch {
    }
    try {
      channel.socket?.destroy();
    } catch {
    }
    channel.socket = void 0;
    channel.authed = false;
    channel.readBuffer = "";
    channel.authPromise = void 0;
  }
  // ====================================================================
  // ===========================  HELPERS  ==============================
  // ====================================================================
  drainBuffer(channel, resolveAuth, rejectAuth, authTimer) {
    let nl = channel.readBuffer.indexOf("\n");
    while (nl !== -1) {
      const line = channel.readBuffer.slice(0, nl);
      channel.readBuffer = channel.readBuffer.slice(nl + 1);
      nl = channel.readBuffer.indexOf("\n");
      if (!line.trim()) continue;
      let msg;
      try {
        msg = JSON.parse(line);
      } catch (err) {
        continue;
      }
      switch (msg.type) {
        case A_InspectorMessageType.AuthOk: {
          channel.authed = true;
          clearTimeout(authTimer);
          resolveAuth();
          break;
        }
        case A_InspectorMessageType.AuthFail: {
          clearTimeout(authTimer);
          rejectAuth(new A_InspectorError({
            title: A_InspectorError.InspectorAuthError,
            description: msg.reason ?? "auth rejected"
          }));
          break;
        }
        case A_InspectorMessageType.Result: {
          const r = msg;
          const slot = channel.pending.get(r.id);
          if (!slot) break;
          channel.pending.delete(r.id);
          clearTimeout(slot.timer);
          slot.resolve(r.payload);
          break;
        }
        case A_InspectorMessageType.Error: {
          const e = msg;
          if (!e.id) break;
          const slot = channel.pending.get(e.id);
          if (!slot) break;
          channel.pending.delete(e.id);
          clearTimeout(slot.timer);
          slot.reject(new A_InspectorError({
            title: e.error?.title ?? A_InspectorError.InspectorTransportError,
            description: e.error?.description
          }));
          break;
        }
      }
    }
  }
  failAllPending(channel, err) {
    for (const slot of channel.pending.values()) {
      clearTimeout(slot.timer);
      try {
        slot.reject(err);
      } catch {
      }
    }
    channel.pending.clear();
  }
};
__decorateClass([
  A_Feature.Extend({
    name: A_ChannelFeatures.onConnect,
    scope: [InspectorChannel]
  }),
  __decorateParam(0, A_Inject(InspectorChannel)),
  __decorateParam(1, A_Inject(InspectorClientConfig))
], InspectorChannelProcessor.prototype, "onConnect", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_ChannelFeatures.onRequest,
    scope: [InspectorChannel]
  }),
  __decorateParam(0, A_Inject(InspectorChannel)),
  __decorateParam(1, A_Inject(InspectorClientConfig)),
  __decorateParam(2, A_Inject(A_ChannelRequest))
], InspectorChannelProcessor.prototype, "onRequest", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_ChannelFeatures.onDisconnect,
    scope: [InspectorChannel]
  }),
  __decorateParam(0, A_Inject(InspectorChannel))
], InspectorChannelProcessor.prototype, "onDisconnect", 1);
InspectorChannelProcessor = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Lifecycle handlers for InspectorChannel \u2014 TCP socket, auth handshake, multiplexed command roundtrips."
  })
], InspectorChannelProcessor);

export { InspectorChannelProcessor };
//# sourceMappingURL=InspectorChannelProcessor.component.mjs.map
//# sourceMappingURL=InspectorChannelProcessor.component.mjs.map