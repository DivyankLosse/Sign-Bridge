from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json
import traceback
import asyncio
from app.sign_recognition.predict import predict_sign_batch
from app.nlp_correction.grammar_corrector import grammar_corrector

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
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    # Depending on auth, token validation goes here.
    await manager.connect(websocket)
    
    frame_buffer = []
    BUFFER_SIZE = 20 # User requested snappy 20 frames
    
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
                    
                    if len(frame_buffer) >= BUFFER_SIZE and not is_processing:
                        is_processing = True
                        try:
                            # Process hybrid sequence off the main thread
                            from app.sign_recognition.predict import predict_hybrid
                            
                            client_mode = payload.get("mode", "AUTO")
                            client_threshold = payload.get("threshold", 0.7)
                            
                            result = await asyncio.to_thread(
                                predict_hybrid, 
                                list(frame_buffer), 
                                mode=client_mode, 
                                threshold=client_threshold
                            )
                            
                            raw_pred = result.get("prediction")
                            pred_mode = result.get("mode", "spell")
                            
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
                            
                            # Sliding window: keep buffer for smoothness
                            frame_buffer = frame_buffer[10:] 
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
