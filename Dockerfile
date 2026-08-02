FROM node:22-slim

# Install Python3, WeasyPrint system dependencies, and Arabic fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-setuptools python3-wheel \
    libpango-1.0-0 libpangocairo-1.0-0 libpangoft2-1.0-0 \
    libcairo2 libgdk-pixbuf2.0-0 \
    libffi-dev libxml2 libxslt1.1 \
    libharfbuzz0b libfribidi0 \
    libjpeg62-turbo libopenjp2-7 \
    fontconfig shared-mime-info \
    fonts-noto-core fonts-noto-cjk \
    curl ca-certificates \
    && pip3 install --no-cache-dir weasyprint --break-system-packages \
    && python3 -c "import weasyprint; print('WeasyPrint OK:', weasyprint.__version__)" \
    && rm -rf /var/lib/apt/lists/*

# Install Cairo Arabic font for proper RTL rendering
RUN mkdir -p /usr/share/fonts/truetype/cairo \
    && curl -sL "https://github.com/google/fonts/raw/main/ofl/cairo/static/Cairo-Regular.ttf" \
       -o /usr/share/fonts/truetype/cairo/Cairo-Regular.ttf \
    && curl -sL "https://github.com/google/fonts/raw/main/ofl/cairo/static/Cairo-Bold.ttf" \
       -o /usr/share/fonts/truetype/cairo/Cairo-Bold.ttf \
    && curl -sL "https://github.com/google/fonts/raw/main/ofl/cairo/static/Cairo-SemiBold.ttf" \
       -o /usr/share/fonts/truetype/cairo/Cairo-SemiBold.ttf \
    && fc-cache -fv /usr/share/fonts/truetype/cairo/

WORKDIR /app
COPY . .
RUN npm install -g corepack@latest && corepack pnpm install && corepack pnpm run build
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
