## 2 of the 4 features are Gemini output, and the mind map needed few-shot prompting

Pulling structured knowledge out of a book is manual work, so in 2024 I built ConceptHub to take a pasted text and hand the structure back.

| Feature | Comes from |
| --- | --- |
| Summary of a book text | Gemini API |
| Mind map of concepts, themes and relationships | Gemini API |
| Quotes with annotations, shareable | PostgreSQL |
| Knowledge base with search | PostgreSQL |

The mind map came back in the same shape on every call only after the prompt carried worked examples, and which model I called mattered less than that.

## 3 record types share one relational shape, so PostgreSQL over a document store

Mind maps, quotes and annotations were structured content from the start, so all three live in a PostgreSQL instance on Vercel and are read in SQL.

## 3 deployments across 2 providers, for one 2024 project

The Python and FastAPI service runs in Docker containers on GCP, while the React frontend and the PostgreSQL instance both sit on Vercel.
Authentication, session management and content persistence are implemented, and the deployment is public.
It was my first full-stack project wired to a production LLM API, and keeping that split running took more operating time than the size of the project justified.
