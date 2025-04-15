# Gunakan Node versi stabil
FROM node:18

# Set direktori kerja
WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file ke container
COPY . .

# Expose port (disesuaikan jika kamu pakai port lain)
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
