# hackathon-final-destination

# Hackathon final destination

Diagramme
<img width="745" alt="image" src="https://github.com/ChrisBradford2/hackathon-final-destination/assets/59414269/c5bd6c53-0449-4638-af95-34c99f468cfa">

## Features

- Transcribe an audio file with help of 2 AI model, whisper for raw Transcribe then Phi3 for refining the transcription.
- Sentimental analysis of the transcription output to return a note from 1 to 5 in order to trigger an alert if the patient is in need of intervention



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
