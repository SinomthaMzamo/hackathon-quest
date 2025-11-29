import os
from dotenv import load_dotenv
from google.cloud import texttospeech
from google.oauth2 import service_account

# Load environment variables from .env
load_dotenv()

credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not credentials_path or not os.path.exists(credentials_path):
    raise FileNotFoundError(f"Service account JSON not found at {credentials_path}")

# Load service account credentials
credentials = service_account.Credentials.from_service_account_file(credentials_path)

# Initialize TTS client
client = texttospeech.TextToSpeechClient(credentials=credentials)

# Input text
synthesis_input = texttospeech.SynthesisInput(
    text="Hello! This is a test of South African English TTS, let's dance!."
)

# Voice selection for South African English
voice = texttospeech.VoiceSelectionParams(
    language_code="en-ZA",   # South African English
    ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    # Optional: you can try name="en-ZA-Wavenet-A" for a WaveNet voice
)

# Audio configuration
audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3
)

# Perform TTS request
response = client.synthesize_speech(
    input=synthesis_input,
    voice=voice,
    audio_config=audio_config
)

# Save to MP3
output_file = "hello_en_ZA.mp3"
with open(output_file, "wb") as out:
    out.write(response.audio_content)

print(f"Audio content written to {output_file}")
