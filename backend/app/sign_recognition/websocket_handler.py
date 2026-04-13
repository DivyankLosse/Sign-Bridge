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
    BUFFER_SIZE = 30 # Match WLASL sequence length (approx 1.5 - 2s @ 15-20fps)
    
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
                            # Process sequence off the main thread
                            # We use predict_sign_sequence now
                            from app.sign_recognition.predict import predict_sign_sequence
                            result = await asyncio.to_thread(predict_sign_sequence, list(frame_buffer))
                            
                            raw_pred = result.get("prediction")
                            
                            # Apply NLP correction if enabled
                            corrected_text = raw_pred
                            if raw_pred and raw_pred != "MODEL_NOT_LOADED":
                                if payload.get("nlp_correction", True):
                                    corrected_text = await asyncio.to_thread(grammar_corrector.correct, raw_pred)
                            
                            response = {
                                "type": "prediction",
                                "raw_prediction": raw_pred,
                                "corrected_prediction": corrected_text,
                                "confidence": result.get("confidence", 0.0),
                                "landmarks_detected": result.get("landmarks_detected", False)
                            }
                            
                            await websocket.send_json(response)
                            
                            # Sliding window: keep some frames for context in next prediction
                            # e.g. keep last 15 frames
                            frame_buffer = frame_buffer[15:] 
                        finally:
                            is_processing = False
                    elif len(frame_buffer) > 100: # Safety cap
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
