# Hackathon final destination

## Diagramme
<img width="745" alt="image" src="https://github.com/ChrisBradford2/hackathon-final-destination/assets/59414269/c5bd6c53-0449-4638-af95-34c99f468cfa">

## Comment lancer le projet:

Il faut ollama en local a fin de faire tourner phi3 

- Backend:
    ```
    cd back
    ollama pull phi3:latest
    docker compose up --build
    ```
- Frontend:
    ```
    cd front
    npm i
    npm run dev
    ```

## Membre d'equipe:
- Dev:
   - Nicolas BARBARISI (ChrisBradford2)
   - Elodie JOLO (elodiejl)
   - Remy SCHERIER (DrAtsiSama)
   - Viet-Anh BUI (vietanh2810)
- Marketing:
   - Anaele DUPRESSOIR 

## Stack technique:
    Backend:
    - Python Flask pour API Rest
    - Ollama local pour model Phi3 (ameliorer des transcriptions)
    - HuggingFace pipeline pour Bert/Whisper (Analyser sentiment/Transcrire)

    Frontend:
    - React/Vite
    - Tailwind Css

## Features

- Transcrire un fichier audio à l'aide de 2 modèles d'IA : Whisper pour la transcription brute, puis Phi3 pour affiner la transcription.
- Analyse sentimentale de la transcription pour attribuer une note de 1 à 5 afin de déclencher une alerte par SMS si le patient a besoin d'une intervention.



## API Reference

#### Upload an audio

```http
  POST /upload_audio
```

| Argument | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `file` | `wav file` | **Required**.The audio file to be uploaded.|

#### Get all audios

```http
  GET /audios
```

#### Get a specific audio

```http
  GET /audio/{audio_id}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `audio_id`| `integer`| **Required**. The ID of the audio file to fetch |


#### Trigger analyse process on an audio

```http
  POST /process_audio/{audio_id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `audio_id`| `integer`| **Required**. The ID of the audio file to process |
