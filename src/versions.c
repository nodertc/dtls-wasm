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

#include <gnutls/gnutls.h>
#include <gmp.h>

// GnuTLS version

// TODO: change to BREAKING.FEATURE.FIX

int dtls_gnutls_version_major() {
  return GNUTLS_VERSION_MAJOR;
}

int dtls_gnutls_version_minor() {
  return GNUTLS_VERSION_MINOR;
}

int dtls_gnutls_version_patch() {
  return GNUTLS_VERSION_PATCH;
}

// GMP version

int dtls_gmp_version_major() {
  return __GNU_MP_VERSION;
}

int dtls_gmp_version_minor() {
  return __GNU_MP_VERSION_MINOR;
}

int dtls_gmp_version_patch() {
  return __GNU_MP_VERSION_PATCHLEVEL;
}
