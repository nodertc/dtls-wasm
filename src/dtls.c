/**
 * Copyright (c) 2017 Dmitriy Tsvettsikh
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
**/

// @example https://gitlab.com/ocserv/ocserv/blob/master/src/worker-vpn.c#L327
// @example https://gitlab.com/ocserv/ocserv/blob/master/src/worker.h#L170
// @link https://www.gnutls.org/manual/html_node/Core-TLS-API.html
// @link https://www.gnutls.org/manual/html_node/Client-examples.html#Client-examples

#include "common.h"
#include <emscripten.h>
#include <gnutls/dtls.h>
#include <stdlib.h>

extern int dtls_js_certificate_verify(dtls_session_t *session, const unsigned char *data, unsigned int size, unsigned int list_size);
extern int dtls_js_handshake_hook_func(dtls_session_t* session, unsigned int htype, unsigned int incoming);

dtls_session_t* dtls_alloc_session() {
  return (dtls_session_t*) malloc(sizeof(dtls_session_t));
}

// The callback function should return 0 for the handshake
// to continue or non-zero to terminate.
int dlts_certificate_verify(gnutls_session_t session) {
  unsigned int list_size;
  const gnutls_datum_t *certs = gnutls_certificate_get_peers(session, &list_size);

  // Also, return NULL if certificate is not used.
  if (certs == NULL) {
    return -1;
  }

  return dtls_js_certificate_verify((dtls_session_t *)gnutls_session_get_ptr(session), certs->data, certs->size, list_size);
}

int dtls_handshake_hook_func(gnutls_session_t session,
                            unsigned int htype,
                            unsigned post,
                            unsigned int incoming,
                            const gnutls_datum_t *message)
{
  return dtls_js_handshake_hook_func((dtls_session_t*)gnutls_session_get_ptr(session), htype, incoming);
}

int dtls_setup_session(dtls_session_t* dtls, unsigned int flags) {
  int ret = gnutls_init(&dtls->session, flags);

  if (ret < 0) {
    return ret;
  }

  gnutls_session_set_ptr(dtls->session, dtls);
  gnutls_transport_set_ptr(dtls->session, dtls);

  // setup transport hooks.
  gnutls_transport_set_push_function(dtls->session, dtls_push_func);
  gnutls_transport_set_pull_function(dtls->session, dtls_pull_func);
  gnutls_session_set_verify_function(dtls->session, dlts_certificate_verify);

  // setup message hooks.
  gnutls_handshake_set_hook_function(dtls->session, GNUTLS_HANDSHAKE_ANY, GNUTLS_HOOK_PRE, dtls_handshake_hook_func);

  return 0;
}

void dtls_close_session(dtls_session_t* dtls) {
  gnutls_deinit(dtls->session);
  free(dtls);
}

// This function will set the timeouts required for the DTLS handshake protocol.
// @link https://www.gnutls.org/reference/gnutls-dtls.html#gnutls-dtls-set-timeouts
void dtls_set_timeouts(dtls_session_t* dtls, unsigned int retrans_timeout,unsigned int total_timeout) {
  gnutls_dtls_set_timeouts(dtls->session, retrans_timeout, total_timeout);
}

// This function will return the milliseconds remaining for a retransmission of
// the previously sent handshake message.
// @link https://www.gnutls.org/reference/gnutls-dtls.html#gnutls-dtls-get-timeout
unsigned int dtls_get_timeout(dtls_session_t* dtls) {
  return gnutls_dtls_get_timeout(dtls->session);
}

// This function will return the MTU size as set with dtls_set_mtu().
// @link https://www.gnutls.org/reference/gnutls-dtls.html#gnutls-dtls-get-mtu
unsigned int dtls_get_mtu (dtls_session_t* dtls) {
  return gnutls_dtls_get_mtu(dtls->session);
};

// This function will set the maximum transfer unit of the transport
// that DTLS packets are sent over.
// @link https://www.gnutls.org/reference/gnutls-dtls.html#gnutls-dtls-set-mtu
void dtls_set_mtu (dtls_session_t* dtls, unsigned int mtu) {
  gnutls_dtls_set_mtu(dtls->session, mtu);
};

EMSCRIPTEN_KEEPALIVE gnutls_session_t dtls_get_gnutls_session(dtls_session_t *dtls) {
  return dtls->session;
}
