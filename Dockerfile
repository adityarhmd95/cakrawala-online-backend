# Menggunakan image Node.js versi LTS
FROM node:18-alpine

# Buat direktori app
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file proyek
COPY . .

# Expose port yang digunakan aplikasi
EXPOSE 8080

# Command untuk menjalankan aplikasi
CMD ["node", "src/app.js"]