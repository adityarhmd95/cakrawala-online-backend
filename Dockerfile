# Gunakan image node sebagai base
FROM node:14

# Tentukan direktori kerja dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Salin semua file dari proyek ke container
COPY . .

# Expose port aplikasi (port ini harus sama dengan yang dipakai di app.listen)
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "index.js"]
