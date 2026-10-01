FROM node:22-alpine
WORKDIR /app

# Copy application files
COPY . .

# Hugging Face Spaces uses port 7860 by default
ENV PORT=7860
EXPOSE 7860

CMD ["node", "server.mjs"]
