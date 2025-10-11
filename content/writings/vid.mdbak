---
title: "Summarizing Videos with AI"
description: "A proof-of-concept project that distills video content into concise summaries using AI."
pubDate: 2025-07-30
draft: true
---
Just today, a casual chat with a colleague sparked an idea that I couldn't wait to try implementing after work: building an AI-powered video summarizer. The result is `vid`, 
a proof-of-concept project designed to distil video content into summaries.

The core idea behind `vid` is to meticulously leverage both the audio and visual streams of a video, process them with specialized AI models 
and then synthesize these diverse insights into a coherent, high-value summary.

### The `vid` Pipeline: How It Works

Here's a quick look under the hood at the workflow:

1.  **Audio Extraction & Transcription:** The journey begins with `FFmpeg`, which extracts the audio track from the input video. This audio is then fed into `OpenAI Whisper`, a powerful speech-to-text model, generating a detailed transcript complete with timestamps. This gives `vid` the spoken content of the video.

2.  **Intelligent Frame Selection:** For the visual component, `OpenCV` is at the heart of the process. Rather than extracting every single frame (which would be inefficient and redundant), `vid` processes frames to identify those with significant visual changes. A subsequent filtering step is applied to remove visually similar frames, ensuring that only truly distinct moments — "key frames" — are captured. This keeps the visual data meaningful and focused.

3.  **Visual Context with Gemma:** Each carefully selected key frame is then sent to `Gemma 3`, which I'm running locally via `Ollama`. `Gemma` analyzes these images and generates precise textual descriptions of their content. This crucial step enriches the video's understanding beyond mere spoken words, adding vital visual context that a transcript alone can't provide.

4.  **Unified Summarization:** Finally, the multimodal magic happens. Both the comprehensive audio transcript and the detailed visual descriptions of the key frames are combined. This rich, integrated input is then fed back into `Gemma 3`. With this holistic view of the video's content and visuals, `Gemma` is prompted to generate the ultimate concise summary, capturing the essence of the entire video.

### System Overview

For a visual walkthrough of how these components fit together, check out the system mockup:
![System Overview](https://github.com/t128n/proof-of-concept-vid/raw/main/system.png)

### Get Involved

This project is very much a proof of concept, but it establishes a robust foundation for more advanced video understanding and summarization systems. If you're intrigued by the technical implementation or want to experiment with it yourself, the code is open-source and available on GitHub.

Explore `vid` on GitHub: [https://github.com/t128n/proof-of-concept-vid](https://github.com/t128n/proof-of-concept-vid)