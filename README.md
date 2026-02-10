# Ne Pişirsem?

Bu proje, kullanıcının evinde bulunan malzemelere göre yemek önerileri sunan
basit bir React web uygulamasıdır.

Amaç; React’te state yönetimi, component yapısı ve kullanıcı etkileşimlerini
öğrenmek ve sunum odaklı bir arayüz geliştirmektir.

## Özellikler

- Malzeme ekleme (virgülle ayırarak)
- Eklenen malzemeleri etiket (chip) olarak gösterme
- Malzemelere göre en uygun 3 yemeği önerme
- Öneri sırasında bekleme/animasyon efekti
- Yemek kartları (görsel, süre, zorluk bilgisi)
- Tarif detaylarını gösteren modal ekran
  - Var olan malzemeler
  - Eksik malzemeler
  - Adım adım tarif

## Kullanılan Teknolojiler

- React + Vite (JavaScript)
- CSS
- Dummy (statik) veri ile çalışma
- Backend henüz yok

## Proje Yapısı

- `App.jsx` → Uygulama akışı ve state yönetimi
- `components/` → Arayüz bileşenleri
- `data/recipes.js` → Örnek tarif verileri
- `utils/matchRecipes.js` → Tarif eşleştirme mantığı

## Kurulum ve Çalıştırma

```bash
npm install
npm run dev
