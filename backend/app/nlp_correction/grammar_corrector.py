import logging

class GrammarCorrector:
    def __init__(self):
        # Removed language_tool_python to avoid Java dependency in production
        logging.info("GrammarCorrector initialized with lightweight rule-based engine.")

    def correct(self, text: str) -> str:
        """
        Lightweight, Python-native text correction for Sign Language translations.
        Handles capitalization, whitespace, and basic punctuation.
        """
        if not text or not text.strip():
            return text
            
        # 1. Basic whitespace cleanup
        text = " ".join(text.split()).strip()
        
        # 2. Heuristic capitalization: First letter of sentences
        if len(text) > 0:
            if not text[0].isupper():
                text = text[0].upper() + text[1:]
        
        # 3. Simple punctuation: Add a period if missing and it's a long string
        if len(text) > 10 and not text.endswith(('.', '?', '!')):
            text += "."
            
        # 4. Handle common lowercase proper nouns if needed (stub)
        # For an MVP, basic capitalization is usually enough for readability.
        
        return text

# Singleton instance to maintain compatibility
grammar_corrector = GrammarCorrector()
