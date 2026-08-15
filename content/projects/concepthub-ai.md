## In short

- Pulling structured knowledge out of a book is manual work: I wanted a platform where you upload a text and get summaries, key concepts and a visual mind map back.
- ConceptHub is a full-stack web platform built on Google's Gemini API, with React and TypeScript on the front, a Python service in the middle and PostgreSQL behind it.
- Authentication, session management and content persistence are fully implemented, so it is a working platform rather than a demo.
- It was my first full-stack project integrating a production LLM API, and the lessons were mostly about prompting and operational overhead.

## What users can do

- **Generate AI summaries** from book texts using Google's Gemini API
- **Create interactive mind maps** that visually organize key concepts, themes and relationships
- **Save and share quotes** with annotations
- **Build a knowledge base** with persistent storage and search

The platform handles the entire flow: text input, AI processing, structured output, collaborative sharing.

## Stack

- **Frontend**: React and TypeScript, for type-safe component-driven UI development
- **Backend**: a Python service handling Gemini API integration and text processing
- **Database**: PostgreSQL on Vercel, queried in SQL for data persistence
- **Infrastructure**: Docker containers deployed on GCP, with the frontend on Vercel

The stack reflects the balance I wanted between development speed and production quality.

## What I learned

- **Prompt engineering mattered more than model choice** for structured output generation. Getting Gemini to produce consistent mind map structures required careful few-shot prompting.
- **SQL beat NoSQL for structured content.** Mind maps, quotes and annotations have a clear relational structure, so PostgreSQL was the right choice over a document store.
- **Deployment complexity scales non-linearly.** Docker plus GCP plus Vercel worked well, but the operational overhead of managing multiple services was significantly higher than expected for a project this size.
