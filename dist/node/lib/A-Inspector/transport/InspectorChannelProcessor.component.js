'use strict';

var aConcept = require('@adaas/a-concept');
var core = require('@adaas/a-frame/core');
var aChannel = require('@adaas/a-utils/a-channel');
var AInspector_constants = require('../A-Inspector.constants');
var AInspector_error = require('../A-Inspector.error');
var InspectorChannel = require('./InspectorChannel');
var InspectorClientConfig_fragment = require('./InspectorClientConfig.fragment');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
async function loadNet() {
  try {
    const req = eval('typeof require !== "undefined" ? require : undefined');
    if (req) return req("net");
  } catch {
  }
  return await Function('return import("net")')();
}
exports.InspectorChannelProcessor = class InspectorChannelProcessor extends aConcept.A_Component {
  async onConnect(channel, config) {
    const net = await loadNet();
    const { host, port, secret, timeout } = config;
    channel.authPromise = new Promise((resolve, reject) => {
      const socket = net.createConnection({ host, port }, () => {
        socket.write(JSON.stringify({
          type: AInspector_constants.A_InspectorMessageType.Auth,
          secret
        }) + "\n");
      });
      channel.socket = socket;
      socket.setEncoding("utf8");
      const authTimer = setTimeout(() => {
        socket.destroy();
        reject(new AInspector_error.A_InspectorError({
          title: AInspector_error.A_InspectorError.InspectorTransportError,
          description: `inspector auth handshake timed out after ${timeout}ms`
        }));
      }, timeout);
      socket.on("data", (chunk) => {
        channel.readBuffer += chunk;
        this.drainBuffer(channel, resolve, reject, authTimer);
      });
      socket.on("error", (err) => {
        clearTimeout(authTimer);
        const e = new AInspector_error.A_InspectorError({
          title: AInspector_error.A_InspectorError.InspectorTransportError,
          description: err?.message ?? String(err)
        });
        if (!channel.authed) reject(e);
        this.failAllPending(channel, e);
      });
      socket.on("close", () => {
        clearTimeout(authTimer);
        const e = new AInspector_error.A_InspectorError({
          title: AInspector_error.A_InspectorError.InspectorTransportError,
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
      throw new AInspector_error.A_InspectorError({
        title: AInspector_error.A_InspectorError.InspectorTransportError,
        description: "inspector channel is not connected"
      });
    }
    const { code, payload } = request.params;
    const id = `inspector-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const timeout = config.timeout;
    const resultPayload = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        channel.pending.delete(id);
        reject(new AInspector_error.A_InspectorError({
          title: AInspector_error.A_InspectorError.InspectorTransportError,
          description: `inspector command '${code}' timed out after ${timeout}ms`
        }));
      }, timeout);
      channel.pending.set(id, { id, resolve, reject, timer });
      const msg = {
        type: AInspector_constants.A_InspectorMessageType.Command,
        id,
        payload: { ...payload, code }
      };
      channel.socket.write(JSON.stringify(msg) + "\n");
    });
    request.succeed({ payload: resultPayload });
  }
  async onDisconnect(channel) {
    this.failAllPending(channel, new AInspector_error.A_InspectorError({
      title: AInspector_error.A_InspectorError.InspectorTransportError,
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
        case AInspector_constants.A_InspectorMessageType.AuthOk: {
          channel.authed = true;
          clearTimeout(authTimer);
          resolveAuth();
          break;
        }
        case AInspector_constants.A_InspectorMessageType.AuthFail: {
          clearTimeout(authTimer);
          rejectAuth(new AInspector_error.A_InspectorError({
            title: AInspector_error.A_InspectorError.InspectorAuthError,
            description: msg.reason ?? "auth rejected"
          }));
          break;
        }
        case AInspector_constants.A_InspectorMessageType.Result: {
          const r = msg;
          const slot = channel.pending.get(r.id);
          if (!slot) break;
          channel.pending.delete(r.id);
          clearTimeout(slot.timer);
          slot.resolve(r.payload);
          break;
        }
        case AInspector_constants.A_InspectorMessageType.Error: {
          const e = msg;
          if (!e.id) break;
          const slot = channel.pending.get(e.id);
          if (!slot) break;
          channel.pending.delete(e.id);
          clearTimeout(slot.timer);
          slot.reject(new AInspector_error.A_InspectorError({
            title: e.error?.title ?? AInspector_error.A_InspectorError.InspectorTransportError,
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
  aConcept.A_Feature.Extend({
    name: aChannel.A_ChannelFeatures.onConnect,
    scope: [InspectorChannel.InspectorChannel]
  }),
  __decorateParam(0, aConcept.A_Inject(InspectorChannel.InspectorChannel)),
  __decorateParam(1, aConcept.A_Inject(InspectorClientConfig_fragment.InspectorClientConfig))
], exports.InspectorChannelProcessor.prototype, "onConnect", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: aChannel.A_ChannelFeatures.onRequest,
    scope: [InspectorChannel.InspectorChannel]
  }),
  __decorateParam(0, aConcept.A_Inject(InspectorChannel.InspectorChannel)),
  __decorateParam(1, aConcept.A_Inject(InspectorClientConfig_fragment.InspectorClientConfig)),
  __decorateParam(2, aConcept.A_Inject(aChannel.A_ChannelRequest))
], exports.InspectorChannelProcessor.prototype, "onRequest", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: aChannel.A_ChannelFeatures.onDisconnect,
    scope: [InspectorChannel.InspectorChannel]
  }),
  __decorateParam(0, aConcept.A_Inject(InspectorChannel.InspectorChannel))
], exports.InspectorChannelProcessor.prototype, "onDisconnect", 1);
exports.InspectorChannelProcessor = __decorateClass([
  core.A_Frame.Define({
    namespace: "A-Utils",
    description: "Lifecycle handlers for InspectorChannel \u2014 TCP socket, auth handshake, multiplexed command roundtrips."
  })
], exports.InspectorChannelProcessor);
//# sourceMappingURL=InspectorChannelProcessor.component.js.map
//# sourceMappingURL=InspectorChannelProcessor.component.js.map