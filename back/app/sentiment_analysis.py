from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
from flask import current_app as app
from .transcription import transcribe_audio
import os
import requests
import json as json_py

sentiment_pipeline = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment", tokenizer="nlptown/bert-base-multilingual-uncased-sentiment", max_length=512, truncation=True)

def process_audio(audio_file):
    transcription = transcribe_audio(audio_file)
    refine_trans = refine_transcription(transcription)
    # analyze_sentiment(refine_trans)
    # analyze_retour(refine_trans)

    return refine_trans

def analyze_sentiment(text):
    result = sentiment_pipeline(text)[0]
    label_map = {
        "1 star": "Très négatif",
        "2 stars": "Négatif",
        "3 stars": "Neutre",
        "4 stars": "Positif",
        "5 stars": "Très positif"
    }
    sentiment = {
        "label": label_map.get(result['label'], "Inconnu"),
        "score": result['score']
    }
    return sentiment

def fixError_transcription(transcription):
    system_prompt = """Vous êtes un assistant avancé de raffinement de texte spécialisé dans l'analyse des transcriptions audio pour en vérifier la cohérence et l'exactitude.
        Votre tâche consiste à examiner la transcription pour y détecter d'éventuelles erreurs, telles que des mots mal transcrits mais qui sonnent similaires aux mots corrects.
        Fixez la transcription et retournes la version plsu pertinence.
        Le retour doit être au format texte brut et impérativement en langue française."""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Voici la transcription du retour du patient : " + transcription}
    ]

    url = "http://host.docker.internal:11434/api/chat"

    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "model": "phi3:latest",
        "messages": messages,
        "stream": False
    }

    response = requests.post(url, headers=headers, data=json_py.dumps(data))

    if response.status_code == 200:
        response_text = response.text.strip()
        app.logger.info(f"Received response from Llama API: {response_text}")

        # Extract the transcription content from the JSON response
        try:
            response_data = json_py.loads(response_text)
            generated_text = response_data["message"]["content"]
            app.logger.info(f"Extracted refined transcription: {generated_text}")
            return {"transcription": generated_text}
        except (json_py.JSONDecodeError, KeyError) as e:
            app.logger.warning(f"Failed to parse response as JSON or extract refined transcription: {str(e)}")
            return {"error": "Failed to parse response"}
    else:
        app.logger.error(f"Error during transcription refinement. Status code: {response.status_code}")
        return {"error": f"Error during transcription refinement. Status code: {response.status_code}"}

def refine_transcription(transcription):
    system_prompt = """Vous êtes un assistant avancé de raffinement de texte spécialisé dans l'analyse des transcriptions audio pour en vérifier la cohérence et l'exactitude.
    Votre tâche consiste à examiner la transcription pour y détecter d'éventuelles erreurs, telles que des mots mal transcrits mais qui sonnent similaires aux mots corrects.
    Faites un résumé de la transcription et donnez votre avis sur les sentiments exprimés par le patient.
    Votre objectif est de produire l'analyse de sentiment la plus précise et contextuellement appropriée possible.
    Le retour doit être au format texte brut et impérativement en langue française."""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Voici la transcription du retour du patient : " + transcription}
    ]

    url = "http://host.docker.internal:11434/api/chat"

    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "model": "phi3:latest",
        "messages": messages,
        "stream": False
    }

    response = requests.post(url, headers=headers, data=json_py.dumps(data))

    if response.status_code == 200:
        response_text = response.text.strip()
        app.logger.info(f"Received response from Llama API: {response_text}")

        # Extract the transcription content from the JSON response
        try:
            response_data = json_py.loads(response_text)
            generated_text = response_data["message"]["content"]
            app.logger.info(f"Extracted refined transcription: {generated_text}")
            return {"transcription": generated_text}
        except (json_py.JSONDecodeError, KeyError) as e:
            app.logger.warning(f"Failed to parse response as JSON or extract refined transcription: {str(e)}")
            return {"error": "Failed to parse response"}
    else:
        app.logger.error(f"Error during transcription refinement. Status code: {response.status_code}")
        return {"error": f"Error during transcription refinement. Status code: {response.status_code}"}

def analyze_retour(text):
    model_id = "mistralai/Mixtral-8x7B-Instruct-v0.1"
    tokenizer = AutoTokenizer.from_pretrained(model_id,token=os.environ['HF_TOKEN'])

    model = AutoModelForCausalLM.from_pretrained(model_id, device_map="auto")

    messages = [
        {   "role": "system", 
            "content": """You are an assistant for doctor capable of analyze the return of patient that have been converted to text.
                        Based on the text transcribed from the audio file, detect that whether the patient's condition is good or not.
                        Your return have to be in a json of this format: {"sentiment": "positive"} or {"sentiment": "negative"}."""},
        {"role": "assistant", "content": "Well, I'm quite partial to a good squeeze of fresh lemon juice. It adds just the right amount of zesty flavour to whatever I'm cooking up in the kitchen!"},
        {"role": "user", "content": "Do you have mayonnaise recipes?"}
    ]

    inputs = tokenizer.apply_chat_template(messages, return_tensors="pt").to("cuda")

    outputs = model.generate(inputs, max_new_tokens=20)
    print(tokenizer.decode(outputs[0], skip_special_tokens=True))

    risk_pipeline = pipeline("text-classification", model="nlptown/bert-base-multilingual-uncased-sentiment")
    result = risk_pipeline(text)
    return result[0]







