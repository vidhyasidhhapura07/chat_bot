# numpy,pandas,matplotlib,flask,openai,python-dotenv,flask-cors
from flask import Flask, jsonify, render_template, request
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv(override=True)

# Configure Flask to find templates in parent directory
app = Flask(__name__, template_folder='../templates', static_folder='../static')

client = OpenAI(
    api_key = os.getenv('OPENROUTER_API_KEY'),
    base_url = "https://openrouter.ai/api/v1"
)

@app.route("/") 
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_massage = request.json.get("message")
    print(f"Received user message: {request.json.get('message')}")

    try: 
        respose = client.chat.completions.create(
            model="deepseek/deepseek-chat",
            messages=[
                {"role": "system", "content": " you are Agentic AI, You are a helpful assistant."},
                {"role": "user", "content": user_massage}
            ])
        reply = respose.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"reply" : "Sorry, something went wrong. Please try again later."})
if __name__ == "__main__":
    app.run(debug=True)

