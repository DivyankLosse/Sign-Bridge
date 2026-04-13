from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json
import traceback
import asyncio
# Removed unused imports
from app.nlp_correction.grammar_corrector import grammar_corrector
from app.sign_recognition.predict import predict_hybrid

router = APIRouter(tags=["websocket"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

manager = ConnectionManager()

@router.websocket("/ws/recognize")
async def websocket_endpoint(websocket: WebSocket):
    # Simplified for production stability - token validated in separate logic if needed
    print("[WS] Connection request received")
    await manager.connect(websocket)
    print("[WS] Connection accepted")
    
    frame_buffer = []
    BUFFER_SIZE = 10 # Trigger inference every 10 frames for responsiveness
    TARGET_SEQUENCE_LENGTH = 20 # Keep 20 frames for the Word Model
    
    is_processing = False
    
    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                
                # Check for heartbeat
                if payload.get("type") == "heartbeat":
                    await websocket.send_json({"type": "heartbeat_ack"})
                    continue
                    
                frame = payload.get("frame")
                if frame:
                    # Always add to buffer
                    frame_buffer.append(frame)
                    print(f"[WS] Frame received. Local Buffer size: {len(frame_buffer)}")
                    
                    if len(frame_buffer) >= BUFFER_SIZE and not is_processing:
                        is_processing = True
                        try:
                            # Process hybrid sequence off the main thread
                            from app.sign_recognition.model_loader import model_loader
                            print(f"[WS] MODEL READY: {model_loader.is_ready}")
                            
                            client_mode = payload.get("mode", "AUTO")
                            client_threshold = payload.get("threshold", 0.7)
                            print(f"[WS] Running inference (mode={client_mode}, threshold={client_threshold})")
                            
                            result = await asyncio.to_thread(
                                predict_hybrid, 
                                list(frame_buffer), 
                                mode=client_mode, 
                                threshold=client_threshold
                            )
                            
                            raw_pred = result.get("prediction")
                            pred_mode = result.get("mode", "spell")
                            print(f"[WS] LANDMARKS DETECTED: {result.get('landmarks_detected')}")
                            print(f"[WS] Prediction Result: {raw_pred} (Mode: {pred_mode}, Conf: {result.get('confidence', 0.0)})")
                            
                            # Apply NLP correction if enabled (mostly for word mode)
                            corrected_text = raw_pred
                            if raw_pred and raw_pred != "MODEL_NOT_LOADED":
                                if payload.get("nlp_correction", True):
                                    corrected_text = await asyncio.to_thread(grammar_corrector.correct, raw_pred)
                            
                            response = {
                                "type": "prediction",
                                "raw_prediction": raw_pred,
                                "corrected_prediction": corrected_text,
                                "mode": pred_mode,
                                "confidence": result.get("confidence", 0.0),
                                "landmarks_detected": result.get("landmarks_detected", False)
                            }
                            
                            await websocket.send_json(response)
                            print(f"[WS] SENT TO CLIENT: {raw_pred}")
                            
                            # Rolling window: keep last 20 frames for next inference cycle (preserves word model accuracy)
                            frame_buffer = frame_buffer[-TARGET_SEQUENCE_LENGTH:]
                        finally:
                            is_processing = False
                    elif len(frame_buffer) > 50: # Safety cap
                        frame_buffer = frame_buffer[-BUFFER_SIZE:]
                    else:
                        # Optional: skip specific log for production to avoid spam
                        pass
            except Exception as e:
                print(f"WS processing error: {e}")
                traceback.print_exc()
                is_processing = False # Reset on error
    except WebSocketDisconnect:
        manager.disconnect(websocket)
