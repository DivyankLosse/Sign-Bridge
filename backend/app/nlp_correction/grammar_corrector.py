import language_tool_python
import logging

class GrammarCorrector:
    def __init__(self):
        try:
            # Using Remote language tool to avoid java installation requirements locally if not present
            self.tool = language_tool_python.LanguageTool('en-US')
        except Exception as e:
            logging.error(f"Failed to initialize LanguageTool: {e}")
            self.tool = None

    def correct(self, text: str) -> str:
        if not text or not text.strip():
            return text
            
        # Basic heuristic cleanup
        text = text.strip()
        if not text[0].isupper():
            text = text[0].upper() + text[1:]
            
        if self.tool:
            try:
                # Get matches and correct
                corrected = self.tool.correct(text)
                return corrected
            except Exception as e:
                logging.error(f"Error correcting text: {e}")
                
        return text

grammar_corrector = GrammarCorrector()
