import os
import json
import re
import time
from deep_translator import GoogleTranslator

# Syllable splitter
def split_syllables(word):
    word_lower = word.lower()
    # Strip any non-alphabetic chars for syllable calculation
    w_clean = "".join([c for c in word_lower if c.isalpha()])
    if len(w_clean) <= 2:
        return word_lower
        
    vowels = "aeiouyáéíóúýäöüâêîôûàèìòùãõåæøëěıőűůăąęįųóāēīōū"
    v_indices = [i for i, char in enumerate(w_clean) if char in vowels]
    
    if len(v_indices) <= 1:
        return word_lower
        
    parts = []
    last_idx = 0
    
    for k in range(len(v_indices) - 1):
        v1 = v_indices[k]
        v2 = v_indices[k+1]
        num_consonants = v2 - v1 - 1
        
        if num_consonants == 0:
            split_at = v1 + 1
        elif num_consonants == 1:
            split_at = v1 + 1
        elif num_consonants == 2:
            c1 = w_clean[v1+1]
            c2 = w_clean[v1+2]
            if c2 in 'lr' and c1 in 'bcdfghptv':
                split_at = v1 + 1
            else:
                split_at = v1 + 2
        else:
            split_at = v1 + 2
            
        parts.append(w_clean[last_idx:split_at])
        last_idx = split_at
        
    parts.append(w_clean[last_idx:])
    return "-".join(parts)

def tokenize_sentence(sentence):
    # Split by spaces, but separate punctuation
    return re.findall(r"\w+(?:'\w+)?|[^\w\s]", sentence, re.UNICODE)

def clean_sentence_words(sentence_text):
    # Remove punctuation
    cleaned = re.sub(r"[.,!?;:¿¡]", "", sentence_text)
    return [w for w in cleaned.split() if w]

def translate_batch_fast(translator, text_list):
    if not text_list:
        return []
    
    cleaned_list = [t.strip() for t in text_list]
    joined = "\n".join(cleaned_list)
    try:
        translated = translator.translate(joined)
        parts = [p.strip() for p in translated.split("\n")]
        if len(parts) == len(cleaned_list):
            return parts
        else:
            print(f"Warning: Batch translation length mismatch ({len(parts)} vs {len(cleaned_list)}). Falling back to individual translation...")
    except Exception as e:
        print(f"Warning: Batch translation error: {e}. Falling back to individual translation...")
        
    # Fallback to individual
    result = []
    for text in cleaned_list:
        if not text:
            result.append("")
            continue
        try:
            res = translator.translate(text)
            result.append(res)
        except Exception as e:
            print(f"Error translating '{text}': {e}. Returning original.")
            result.append(text)
        time.sleep(0.2)
    return result

def main():
    # Load english template
    template_path = os.path.join('data', 'english_template.json')
    with open(template_path, 'r', encoding='utf-8') as f:
        template = json.load(f)

    # 34 target languages mapping (excluding Spanish which we process separately)
    languages = {
        'french': {'name': 'French', 'code': 'fr'},
        'german': {'name': 'German', 'code': 'de'},
        'italian': {'name': 'Italian', 'code': 'it'},
        'indonesian': {'name': 'Indonesian', 'code': 'id'},
        'portuguese': {'name': 'Portuguese', 'code': 'pt'},
        'turkish': {'name': 'Turkish', 'code': 'tr'},
        'azerbaijani': {'name': 'Azerbaijani', 'code': 'az'},
        'malay': {'name': 'Malay', 'code': 'ms'},
        'vietnamese': {'name': 'Vietnamese', 'code': 'vi'},
        'polish': {'name': 'Polish', 'code': 'pl'},
        'romanian': {'name': 'Romanian', 'code': 'ro'},
        'swahili': {'name': 'Swahili', 'code': 'sw'},
        'uzbek': {'name': 'Uzbek', 'code': 'uz'},
        'tagalog': {'name': 'Tagalog', 'code': 'tl'},
        'albanian': {'name': 'Albanian', 'code': 'sq'},
        'kosovo': {'name': 'Kosovo', 'code': 'sq'},
        'bosnian': {'name': 'Bosnian', 'code': 'bs'},
        'catalan': {'name': 'Catalan', 'code': 'ca'},
        'croatian': {'name': 'Croatian', 'code': 'hr'},
        'czech': {'name': 'Czech', 'code': 'cs'},
        'danish': {'name': 'Danish', 'code': 'da'},
        'esperanto': {'name': 'Esperanto', 'code': 'eo'},
        'estonian': {'name': 'Estonian', 'code': 'et'},
        'hawaiian': {'name': 'Hawaiian', 'code': 'haw'},
        'icelandic': {'name': 'Icelandic', 'code': 'is'},
        'hungarian': {'name': 'Hungarian', 'code': 'hu'},
        'maori': {'name': 'Maori', 'code': 'mi'},
        'norwegian': {'name': 'Norwegian', 'code': 'no'},
        'swedish': {'name': 'Swedish', 'code': 'sv'},
        'finnish': {'name': 'Finnish', 'code': 'fi'},
        'samoan': {'name': 'Samoan', 'code': 'sm'},
        'slovak': {'name': 'Slovak', 'code': 'sk'},
        'slovenian': {'name': 'Slovenian', 'code': 'sl'},
        'zulu': {'name': 'Zulu', 'code': 'zu'}
    }

    english_stories = template['stories']
    english_sentences_list = template['sentences']

    for lang_key, lang_info in sorted(languages.items()):
        lang_name = lang_info['name']
        lang_code = lang_info['code']
        
        out_filepath = os.path.join('data', f"{lang_key}.json")
        
        # Resume support: skip if the file is already populated (>20KB)
        if os.path.exists(out_filepath) and os.path.getsize(out_filepath) > 20000:
            print(f"Skipping {lang_name} - already populated!")
            continue
            
        print(f"=========================================")
        print(f"Processing Language: {lang_name} ({lang_code})")
        print(f"=========================================")
        
        translator_to = GoogleTranslator(source='en', target=lang_code)
        translator_back = GoogleTranslator(source=lang_code, target='en')
        
        # 1. Translate story titles
        story_keys = [f"story{i}" for i in range(1, 16)]
        titles_en = [english_stories[k]['title'] for k in story_keys]
        titles_trans = translate_batch_fast(translator_to, titles_en)
        story_titles = dict(zip(story_keys, titles_trans))
        time.sleep(0.5)
        
        # 2. Translate story texts in 2 chunks of 8 and 7 to avoid length limits
        texts_en = [english_stories[k]['text'] for k in story_keys]
        chunk1 = texts_en[:8]
        chunk2 = texts_en[8:]
        
        texts_trans1 = translate_batch_fast(translator_to, chunk1)
        texts_trans2 = translate_batch_fast(translator_to, chunk2)
        texts_trans = texts_trans1 + texts_trans2
        story_texts = dict(zip(story_keys, texts_trans))
        time.sleep(0.5)
        
        # 3. Gather unique words
        all_unique_words = set()
        tokenized_stories = {}
        for key in story_keys:
            text = story_texts[key]
            sentences_text = re.split(r'(?<=[.!?])\s+', text)
            story_tokens = []
            for sent in sentences_text:
                if not sent.strip():
                    continue
                tokens = tokenize_sentence(sent)
                for t in tokens:
                    story_tokens.append(t)
                    if t.strip() and not re.match(r'^[^\w\s]+$', t):
                        all_unique_words.add(t)
            tokenized_stories[key] = story_tokens
            
        # 4. Translate unique words back to English (chunks of 100)
        unique_words_list = sorted(list(all_unique_words))
        meanings_dict = {}
        chunk_size = 100
        for i in range(0, len(unique_words_list), chunk_size):
            chunk = unique_words_list[i:i+chunk_size]
            meanings_trans = translate_batch_fast(translator_back, chunk)
            for w, m in zip(chunk, meanings_trans):
                meanings_dict[w] = m
            time.sleep(0.5)
            
        # 5. Build stories content
        stories_data = {}
        for key in story_keys:
            tokens = tokenized_stories[key]
            content_list = []
            for t in tokens:
                is_punc = re.match(r'^[^\w\s]+$', t) is not None
                if is_punc:
                    content_list.append({
                        "word": t,
                        "meaning": "",
                        "sound": ""
                    })
                else:
                    meaning = meanings_dict.get(t, "").lower()
                    meaning = re.sub(r'^[^\w\s]+|[^\w\s]+$', '', meaning)
                    sound = split_syllables(t)
                    content_list.append({
                        "word": t,
                        "meaning": meaning,
                        "sound": sound
                    })
            stories_data[key] = {
                "title": story_titles[key],
                "content": content_list
            }

        # 6. Translate the 50 sentences (present, past, future)
        sentences_data = []
        sents_en_flat = []
        for s in english_sentences_list:
            sents_en_flat.append(s['english']['present'])
            sents_en_flat.append(s['english']['past'])
            sents_en_flat.append(s['english']['future'])
            
        sents_trans_flat = []
        chunk_size_sents = 50
        for i in range(0, len(sents_en_flat), chunk_size_sents):
            chunk = sents_en_flat[i:i+chunk_size_sents]
            chunk_trans = translate_batch_fast(translator_to, chunk)
            sents_trans_flat.extend(chunk_trans)
            time.sleep(0.5)
            
        for idx, s in enumerate(english_sentences_list):
            trans_idx = idx * 3
            pres_trans = sents_trans_flat[trans_idx]
            past_trans = sents_trans_flat[trans_idx + 1]
            fut_trans = sents_trans_flat[trans_idx + 2]
            
            sentences_data.append({
                "id": s['id'],
                "english": s['english'],
                lang_key: {
                    "present": clean_sentence_words(pres_trans),
                    "past": clean_sentence_words(past_trans),
                    "future": clean_sentence_words(fut_trans)
                }
            })

        # Save to JSON file
        output_data = {
            "language": lang_name,
            "stories": stories_data,
            "sentences": sentences_data
        }
        
        with open(out_filepath, 'w', encoding='utf-8') as out_f:
            json.dump(output_data, out_f, ensure_ascii=False, indent=2)
            
        print(f"Saved {lang_name} database successfully to {out_filepath}!")
        time.sleep(0.5)

    # Format Spanish JSON as well
    print("Formatting Spanish JSON...")
    span_filepath = os.path.join('data', "spanish.json")
    with open(span_filepath, 'r', encoding='utf-8') as f:
        spanish_raw = json.load(f)
    with open(span_filepath, 'w', encoding='utf-8') as f:
        json.dump(spanish_raw, f, ensure_ascii=False, indent=2)
    print("Completed all processing!")

if __name__ == "__main__":
    main()
