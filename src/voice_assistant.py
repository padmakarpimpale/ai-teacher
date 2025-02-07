# import pyttsx3
# import sys
# import google.generativeai as genai

# engine = pyttsx3.init()
# engine.setProperty('rate', 150)

# def speak(script):
#     engine.say(script)
#     engine.runAndWait()

# def get_gemini_response(api_key, prompt):
#     genai.configure(api_key=api_key)
#     model = genai.GenerativeModel('gemini-pro')
#     response = model.generate_content(prompt)
#     return response.text

# if __name__ == "__main__":
#     if len(sys.argv) >= 3:
#         query = sys.argv[1]
#         gemini_api_key = sys.argv[2]

#         response = get_gemini_response(gemini_api_key, query)
#         speak(response)
#         print(response)
#     else:
#         print("Invalid input received.")



import pyttsx3
import sys
import google.generativeai as genai

# Initialize Text-to-Speech Engine
engine = pyttsx3.init()
engine.setProperty('rate', 150)  # Adjust speech speed


def speak(script):
    """Converts text to speech."""
    try:
        engine.say(script)
        engine.runAndWait()
    except Exception as e:
        print(f"Speech Error: {e}")


def get_gemini_response(api_key, prompt):
    """Sends a prompt to Gemini API and returns the response."""
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "I'm having trouble connecting to the AI service right now."


def main():
    """Main function to process the query."""
    if len(sys.argv) >= 3:
        query = sys.argv[1]
        gemini_api_key = sys.argv[2]

        # Validate inputs
        if not query.strip() or not gemini_api_key.strip():
            print("Invalid input: Empty query or API key.")
            return

        response = get_gemini_response(gemini_api_key, query)
        if response:
            speak(response)
            print(response)
        else:
            print("No response received from Gemini API.")
    else:
        print("Usage: python voice_assistant.py <query> <api_key>")


if __name__ == "__main__":
    main()
