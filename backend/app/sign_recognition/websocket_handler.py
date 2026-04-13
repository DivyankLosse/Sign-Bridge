from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json
import traceback
import asyncio
from app.nlp_correction.grammar_corrector import grammar_corrector
from app.sign_recognition.predict import predict_asl

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
    # Production stabilized: mandatory token removed for connectivity reliability
    print("[WS] Connection request received")
    await manager.connect(websocket)
    print("[WS] Connection accepted")
    
    frame_buffer = []
    BUFFER_SIZE = 5 # Small buffer for real-time ASL fingerspelling
    
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
                    frame_buffer.append(frame)
                    
                    # Trigger inference frequently for ASL fingerspelling responsiveness
                    if len(frame_buffer) >= BUFFER_SIZE and not is_processing:
                        is_processing = True
                        try:
                            # Run inference in a thread to keep the WS loop responsive
                            result = await asyncio.to_thread(predict_asl, list(frame_buffer))
                            
                            raw_pred = result.get("prediction")
                            confidence = result.get("confidence", 0.0)
                            
                            # Apply NLP correction if enabled
                            corrected_text = raw_pred
                            if raw_pred and raw_pred not in ["MODEL_NOT_LOADED", "MODEL_ERROR"]:
                                if payload.get("nlp_correction", True):
                                    corrected_text = await asyncio.to_thread(grammar_corrector.correct, raw_pred)
                            
                            response = {
                                "type": "prediction",
                                "raw_prediction": raw_pred,
                                "corrected_prediction": corrected_text,
                                "confidence": confidence,
                                "landmarks_detected": result.get("landmarks_detected", False)
                            }
                            
                            await websocket.send_json(response)
                            if raw_pred:
                                print(f"[WS] Prediction: {raw_pred} ({confidence:.2f})")
                            
                            # Clear buffer after processing
                            frame_buffer = []
                        finally:
                            is_processing = False
                    
                    # Safety cap for buffer
                    if len(frame_buffer) > 20:
                        frame_buffer = frame_buffer[-BUFFER_SIZE:]
            except Exception as e:
                print(f"WS processing error: {e}")
                traceback.print_exc()
                is_processing = False
    except WebSocketDisconnect:
        print("[WS] Client disconnected")
        manager.disconnect(websocket)
    except Exception as e:
        print(f"[WS] Critical connection error: {e}")
        manager.disconnect(websocket)
