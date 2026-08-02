# Full rebuild forced: 2026-08-02 v5 - Puppeteer + Chromium
FROM node:22-slim

# Install Chromium and Arabic fonts for Puppeteer PDF generation
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-noto-core \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Cairo Arabic font
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && mkdir -p /usr/share/fonts/truetype/cairo \
    && curl -sL "https://github.com/google/fonts/raw/main/ofl/cairo/static/Cairo-Regular.ttf" \
       -o /usr/share/fonts/truetype/cairo/Cairo-Regular.ttf \
    && curl -sL "https://github.com/google/fonts/raw/main/ofl/cairo/static/Cairo-Bold.ttf" \
       -o /usr/share/fonts/truetype/cairo/Cairo-Bold.ttf \
    && curl -sL "https://github.com/google/fonts/raw/main/ofl/cairo/static/Cairo-SemiBold.ttf" \
       -o /usr/share/fonts/truetype/cairo/Cairo-SemiBold.ttf \
    && fc-cache -fv /usr/share/fonts/truetype/cairo/ \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to use system Chromium (skip bundled download)
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app
COPY . .
RUN npm install -g corepack@latest && corepack pnpm install && corepack pnpm run build

CMD ["node", "dist/index.js"]
