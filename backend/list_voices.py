from google.cloud import texttospeech
import os
from dotenv import load_dotenv

load_dotenv()

def list_voices():
    creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    print(f"Scanning ALL voices using creds: {creds_path}...\n")

    try:
        client = texttospeech.TextToSpeechClient.from_service_account_json(creds_path)
        
        # Request ALL voices (no language filter)
        response = client.list_voices()
        
        found_count = 0
        print("--- SEARCHING FOR SOUTH AFRICAN VOICES ---")
        
        for voice in response.voices:
            # Check every language code for this voice
            for language_code in voice.language_codes:
                if "en-ZA" in language_code:
                    quality = "HIGH (WaveNet)" if "Wavenet" in voice.name else "Standard"
                    print(f"Found: {voice.name}  [{quality}]")
                    found_count += 1
        
        if found_count == 0:
            print("RESULT: No 'en-ZA' voices found. This is a Google Cloud Account restriction.")
            print("TIP: Ensure Billing is enabled on your Google Cloud Project (even for free tier).")
        else:
            print(f"\nSUCCESS: Found {found_count} SA voices!")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_voices()