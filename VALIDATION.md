# Sign Bridge - ASL-Only Production Validation

This document defines the mandatory validation gates for the ASL-only production stabilization project.

## 1. Backend Service Validation
| Test Case | Method | Expected Result | Status |
|-----------|--------|-----------------|--------|
| Startup Stability | Check stdout logs | `[Startup] ASL Model Status: READY` | [ ] |
| Model Readiness | `GET /debug-model` | `ready: true`, `error: false` | [ ] |
| Health Check | `GET /health` | `{"status": "ok"}` | [ ] |
| Keep-Alive | `GET /ping` | `{"status": "alive", ...}` | [ ] |

## 2. WebSocket Connectivity (Nyquist Gate)
| Test Case | Method | Expected Result | Status |
|-----------|--------|-----------------|--------|
| Protocol Upgrade | Connect to `/ws/recognize` | `101 Switching Protocols` | [ ] |
| Handshake Logs | Check stdout logs | `[WS] Connection accepted` | [ ] |
| Heartbeat | Send `{type: "heartbeat"}` | Receive `{"type": "heartbeat_ack"}` | [ ] |
| Prediction Flow | Stream frames with hand | Prediction JSON received in UI | [ ] |

## 3. Resource & Performance
| Test Case | Method | Expected Result | Status |
|-----------|--------|-----------------|--------|
| Memory Footprint | `docker stats` or Render Dashboard | < 450MB RAM usage | [ ] |
| Startup Time | Measure startup duration | < 15 seconds to "Live" state | [ ] |
| Error Resilience | Stop model load intentionally | API returns `MODEL_ERROR` gracefully | [ ] |

## 4. UI/UX Integrity
| Test Case | Method | Expected Result | Status |
|-----------|--------|-----------------|--------|
| Mode Selector | Visit Live Recognition page | No AUTO/WORDS/SPELLING buttons visible | [ ] |
| Status Indicator | UI Header | Shows "CONNECTED" pill when active | [ ] |
| Prediction Display| Use Hand Sign | Real-time text appears in transcript | [ ] |

---
**Approval Gate**: All items marked [x] before shipping to PRODUCTION.
