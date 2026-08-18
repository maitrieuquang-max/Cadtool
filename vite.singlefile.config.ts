import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Bản build 1 file HTML duy nhất — mở trực tiếp bằng trình duyệt (file://)
// target đặt ở mức tương thích rộng để chạy được cả trên máy dùng Chrome/Edge
// đời cũ hơn (tránh lỗi cả app không mở được vì một API quá mới).
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: 'dist-single',
    target: ['chrome96', 'edge96', 'firefox94', 'safari15'],
  },
})
