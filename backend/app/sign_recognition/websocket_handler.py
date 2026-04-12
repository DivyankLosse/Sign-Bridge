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
    BUFFER_SIZE = 5 # Collect 5 frames before doing majority vote (adjustable)
    
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
                    # Only add to buffer if we're not currently busy
                    if not is_processing:
                        frame_buffer.append(frame)
                    
                        if len(frame_buffer) >= BUFFER_SIZE:
                            is_processing = True
                            try:
                                # Process batch off the main thread
                                result = await asyncio.to_thread(predict_sign_batch, list(frame_buffer))
                                
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
                                
                                # Overlap frames to smooth prediction
                                frame_buffer = frame_buffer[-2:] 
                            finally:
                                is_processing = False
                    else:
                        # Optional: skip specific log for production to avoid spam
                        pass
            except Exception as e:
                print(f"WS processing error: {e}")
                traceback.print_exc()
                is_processing = False # Reset on error
    except WebSocketDisconnect:
        manager.disconnect(websocket)
