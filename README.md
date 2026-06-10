# Akıllı E-Posta Yanıt Asistanı (Smart Reply)

Bu proje, gelen e-postaları NLP ve LLM (Gemini API) kullanarak analiz eden ve duygu tonuna uygun yanıt taslakları üreten bir Chrome Eklentisi entegrasyonudur.

## Mimari Desenler
- **Katmanlı Mimari (Layered Architecture):** Controller, Service, Repository katmanları.
- **Repository Pattern & ORM:** Veri erişimi TypeORM üzerinden Generic Repository ile soyutlanmıştır.

## Teknolojiler
- **Backend:** Node.js, Express.js
- **Veritabanı:** Supabase (PostgreSQL)
- **Yapay Zeka:** Google Gemini 1.5 Flash API
- **Eklenti:** Chrome Extension Manifest V3 (VanillaJS, HTML, CSS)
- **Test:** Jest (Mocking yöntemiyle)
- **CI/CD:** GitHub Actions & Render

## CI/CD Pipeline Süreci
GitHub üzerinden açılan Pull Request'lerde `npm test` otomatik çalışır. `main` branch'ine yapılan merge işlemlerinde proje Render üzerine otomatik olarak deploy edilir. Ortam değişkenleri GitHub Secrets ve Render Environment Variables üzerinden güvenle yönetilmektedir.
