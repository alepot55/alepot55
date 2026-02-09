## Motivation

I wanted to explore AI-powered content generation in a practical context: helping people extract structured knowledge from books. The idea was simple: upload a text, and the platform generates summaries, key concepts, and visual mind maps automatically.

## What It Does

**ConceptHub** is a full-stack web platform where users can:

- **Generate AI summaries** from book texts using Google's Gemini API
- **Create interactive mind maps** that visually organize key concepts, themes, and relationships
- **Save and share quotes** with annotations
- **Build a knowledge base** with persistent storage and search

The platform handles the entire flow: text input, AI processing, structured output, and collaborative sharing.

## Architecture

The technical stack reflects the choices I made to balance development speed with production quality:

- **Frontend**: React + TypeScript for type-safe, component-driven UI development
- **Backend**: Python service handling Gemini API integration and text processing
- **Database**: PostgreSQL on Vercel with SQL queries for data persistence
- **Infrastructure**: Docker containers deployed on GCP, with the frontend on Vercel

User authentication, session management, and content persistence are fully implemented. This isn't a demo, it's a functional platform.

## What I Learned

This was my first full-stack project integrating a production LLM API. The main lessons:

- **Prompt engineering matters more than model choice** for structured output generation. Getting Gemini to produce consistent mind map structures required careful few-shot prompting.
- **SQL over NoSQL for structured content**: mind maps, quotes, and annotations have clear relational structure. PostgreSQL was the right choice over a document store.
- **Deployment complexity scales non-linearly**: Docker + GCP + Vercel worked well, but the operational overhead of managing multiple services was significantly higher than expected for a project this size.
