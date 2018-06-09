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

#ifndef DTLS_IO_H
#define DTLS_IO_H

#include <gnutls/gnutls.h>

// DTLS I/O

ssize_t dtls_push_func(gnutls_transport_ptr_t ptr, const void* buf, size_t length);
ssize_t dtls_pull_func(gnutls_transport_ptr_t ptr, void* buf, size_t length);

#endif
