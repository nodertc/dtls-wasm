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

#include "common.h"

extern ssize_t dtls_js_write(dtls_session_t*, const void*, size_t);
extern ssize_t dtls_js_read(dtls_session_t*, void*, size_t);

// GnuTLS IO wrappers
ssize_t dtls_push_func(gnutls_transport_ptr_t ptr, const void* buf, size_t length) {
  dtls_session_t* dtls = ptr;

  return dtls_js_write(dtls, buf, length);
};

// The callback should return 0 on connection termination,
// a positive number indicating the number of bytes received,
// and -1 on error.
ssize_t dtls_pull_func(gnutls_transport_ptr_t ptr, void* buf, size_t length) {
  dtls_session_t* dtls = ptr;

  return dtls_js_read(dtls, buf, length);
};
