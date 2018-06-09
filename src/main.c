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
#include <emscripten.h>
#include <time.h>
#include <stdint.h>

extern void dtls_js_time(void*, size_t);
extern void dtls_js_log(int, const char*);
extern void dtls_js_audit_log(gnutls_session_t*, const char*);

/**
 * Default time function.
 */
time_t dtls_time(time_t* t) {
  time_t time_ = 0;

  dtls_js_time(&time_, sizeof(time_t));
  return time_;
}

/**
 * Default logging function.
 */
void dtls_log(int level, const char* line) {
  dtls_js_log(level, line);
}

/**
 * Default audit logging function.
 */
void dtls_audit_log(gnutls_session_t session, const char* line) {
  dtls_js_audit_log(&session, line);
}

EMSCRIPTEN_KEEPALIVE int main(void) {
  gnutls_global_set_time_function(dtls_time);
  gnutls_global_set_log_function(dtls_log);
  gnutls_global_set_audit_log_function(dtls_audit_log);

  int ret = gnutls_global_init();

  if (ret < 0) {
    return ret;
  }

  return 0;
}
