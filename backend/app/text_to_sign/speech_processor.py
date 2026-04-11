"""
Speech to Sign Language Processor
This module provides NLTK-based text processing and a robust fallback mechanism.
"""

from typing import List, Tuple, Optional
import os
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords

# Ensure NLTK data (quietly)
try:
    nltk.download('punkt', quiet=True)
    nltk.download('punkt_tab', quiet=True)
    nltk.download('averaged_perceptron_tagger', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('omw-1.4', quiet=True)
    nltk.download('stopwords', quiet=True)
except Exception as e:
    print(f"Warning: NLTK download failed: {e}")

ISL_STOPWORDS = {
    "mightn't", "re", "wasn", "wouldn", "be", "has", "that", "does", 
    "shouldn", "do", "you've", "off", "for", "didn't", "m", "ain", 
    "haven", "weren't", "are", "she's", "wasn't", "its", "haven't", 
    "wouldn't", "don", "weren", "s", "you'd", "don't", "doesn", 
    "hadn't", "is", "was", "that'll", "should've", "a", "then", 
    "the", "mustn", "nor", "as", "it's", "needn't", "d", "am", 
    "have", "hasn", "o", "aren't", "you'll", "couldn't", "you're", 
    "mustn't", "didn", "doesn't", "ll", "an", "hadn", "whom", "y", 
    "hasn't", "itself", "couldn", "needn", "shan't", "isn", "been", 
    "such", "shan", "shouldn't", "aren", "being", "were", "did", 
    "ma", "t", "having", "mightn", "ve", "isn't", "won't"
}

def detect_tense(tagged_words: List[Tuple[str, str]]) -> str:
    tense_counts = {"future": 0, "present": 0, "past": 0, "present_continuous": 0}
    for word, tag in tagged_words:
        if tag == "MD": tense_counts["future"] += 1
        elif tag == "VBG": tense_counts["present_continuous"] += 1
        elif tag in ["VBP", "VBZ"]: tense_counts["present"] += 1
        elif tag in ["VBD", "VBN"]: tense_counts["past"] += 1
    
    if tense_counts["past"] >= 1: return "past"
    elif tense_counts["future"] >= 1: return "future"
    elif tense_counts["present_continuous"] >= 1: return "present_continuous"
    return "present"

def lemmatize_word(word: str, pos_tag: str, lemmatizer: WordNetLemmatizer) -> str:
    if pos_tag.startswith('V'): return lemmatizer.lemmatize(word, pos='v')
    elif pos_tag.startswith('J'): return lemmatizer.lemmatize(word, pos='a')
    return lemmatizer.lemmatize(word)

def _process_with_nltk(text: str) -> List[str]:
    """Internal NLTK processing logic"""
    try:
        words = word_tokenize(text)
        if not words: return []
        
        tagged = nltk.pos_tag(words)
        tense = detect_tense(tagged)
        lemmatizer = WordNetLemmatizer()
        
        processed = []
        for word, tag in tagged:
            if word.lower() in ISL_STOPWORDS: continue
            lemma = lemmatize_word(word.lower(), tag, lemmatizer)
            if lemma.upper() == 'I': lemma = 'Me'
            processed.append(lemma.capitalize())
            
        if tense == "past": processed.insert(0, "Before")
        elif tense == "future" and "Will" not in processed: processed.insert(0, "Will")
        elif tense == "present_continuous": processed.insert(0, "Now")
        
        return processed
    except Exception as e:
        print(f"NLTK Processing Error: {e}")
        return []

def process_text_for_sign(text: str, available_animations: set = None) -> List[str]:
    """
    Main processing function with sturdy fallback.
    """
    if not text or not text.strip():
        return []
        
    text = text.strip()
    print(f"Processing: {text}")
    
    # 1. Try NLTK
    processed_words = _process_with_nltk(text)
    
    # 2. If NLTK failed or returned empty (and text wasn't empty), fall back to split
    if not processed_words:
        print("NLTK returned empty/failed. Using fallback split.")
        processed_words = [w.capitalize() for w in text.split()]
    
    # 3. If no available animations list is provided, return words as-is
    if available_animations is None:
        return processed_words
        
    # 4. Map to animations
    final_animations = []
    
    for word in processed_words:
        # Try finding the word
        found_variant = None
        # Check variants: Word, word, WORD
        variants = [word, word.lower(), word.upper(), word.capitalize()]
        
        for v in variants:
            if v in available_animations:
                found_variant = v
                break
        
        if found_variant:
            final_animations.append(found_variant)
        else:
            # Character fallback
            for char in word.upper():
                if char.isalnum() and char in available_animations:
                    final_animations.append(char)
                    
    # 5. Ultimate Fallback: If after all that, final_animations is empty, and proper words exist
    if not final_animations and processed_words:
         # Try one last time with naive split of original text just in case NLTK did weird things
         naive_words = text.split()
         for w in naive_words:
             caps = w.capitalize()
             if caps in available_animations:
                 final_animations.append(caps)
             else:
                 for char in caps.upper():
                      if char in available_animations:
                          final_animations.append(char)

    return final_animations

def get_animation_urls(animation_names: List[str], base_url: str = "/static/animations") -> List[str]:
    return [f"{base_url}/{name}.mp4" for name in animation_names]

def ensure_nltk_data():
    pass # Already done at top level
