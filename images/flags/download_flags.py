import urllib.request
import os
import time

mapping = {
    'albanian': 'al',
    'azerbaijani': 'az',
    'bosnian': 'ba',
    'catalan': 'ad',
    'croatian': 'hr',
    'czech': 'cz',
    'danish': 'dk',
    'estonian': 'ee',
    'finnish': 'fi',
    'hawaiian': 'us-hi', # Hawaii flag, fallback to us
    'hungarian': 'hu',
    'icelandic': 'is',
    'kosovo': 'xk',
    'malay': 'my',
    'maori': 'nz',
    'norwegian': 'no',
    'polish': 'pl',
    'romanian': 'ro',
    'samoan': 'ws',
    'slovak': 'sk',
    'slovenian': 'si',
    'swahili': 'tz',
    'swedish': 'se',
    'tagalog': 'ph',
    'turkish': 'tr',
    'uzbek': 'uz',
    'vietnamese': 'vn',
    'zulu': 'za'
}

# Output directory
out_dir = r"c:\Users\rswar\OneDrive\Desktop\languages\LatinFlow\images\flags"
os.makedirs(out_dir, exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# 1. Download regular flags
for lang, cc in sorted(mapping.items()):
    out_file = os.path.join(out_dir, f"{lang}.jpg")
    
    # Check if already exists
    if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
        print(f"Flag for {lang} already exists, skipping.")
        continue
        
    url = f"https://flagcdn.com/w1600/{cc}.jpg"
    try:
        print(f"Downloading {lang} flag from {url}...")
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as res, open(out_file, 'wb') as f:
            f.write(res.read())
        print(f"Saved successfully to {out_file} ({os.path.getsize(out_file)} bytes)!")
    except Exception as e:
        print(f"Failed to download {lang} flag with {cc}: {e}")
        # Fallback for Hawaii
        if cc == 'us-hi':
            print("Falling back to US flag for Hawaiian...")
            url_fallback = "https://flagcdn.com/w1600/us.jpg"
            try:
                req = urllib.request.Request(url_fallback, headers=headers)
                with urllib.request.urlopen(req) as res, open(out_file, 'wb') as f:
                    f.write(res.read())
                print(f"Saved Hawaii fallback flag successfully to {out_file}!")
            except Exception as ef:
                print(f"Fallback also failed: {ef}")
    time.sleep(0.5)

# 2. Download Esperanto flag separately
esp_file = os.path.join(out_dir, "esperanto.jpg")
if not os.path.exists(esp_file):
    esp_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Flag_of_Esperanto.svg/1024px-Flag_of_Esperanto.svg.png"
    try:
        print(f"Downloading Esperanto flag from {esp_url}...")
        req = urllib.request.Request(esp_url, headers=headers)
        with urllib.request.urlopen(req) as res, open(esp_file, 'wb') as f:
            f.write(res.read())
        print(f"Saved Esperanto flag successfully to {esp_file} ({os.path.getsize(esp_file)} bytes)!")
    except Exception as e:
        print(f"Failed to download Esperanto flag: {e}")

print("All flags download check completed!")
