# Sıfır Nokta

Bağımlılıktan kurtulma yolculuğunda yanınızda olan mobil uygulama. Sigara, alkol, kumar ve madde bağımlılığı için tasarlanmış kapsamlı destek aracı.

## Özellikler

- **Akil Durum Kalkanı**: 90 saniyelik 3 aşamalı dürtü müdahale sistemi (nefes, dikkat değişimi, destek)
- **Günlük Kayıt**: Dürtü yoğunluğu, ruh hali, tetikleyici ve kullanım durumu kaydı
- **AI Risk Analizi**: Günlük kayıtlara dayalı dinamik risk skorlaması ve kişiselleştirilmiş öneriler
- **Tetikleyici Radar**: Geçmiş kayıtlardan otomatik tetikleyici analizi (riskli saatler, günler, tetikleyiciler)
- **Özgürlük Fonu**: Bağımlılıktan tasarruf edilen tahmini tutarın görselleştirilmesi
- **Başarımlar**: Temiz gün, kayıt, müdahale ve destek milestonları
- **Profesyonel Destek**: YEDAM, Yeşilay ve AMATEM merkezleri, danışma hatları
- **Bildirimler**: Günlük hatırlatma ve dürtü destek bildirimleri

## Teknoloji

- **Frontend**: React Native + Expo Router
- **State Yönetimi**: Zustand
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Fontlar**: Inter (Google Fonts)
- **İkonlar**: Lucide React Native

## Kurulum

```bash
npm install
npx expo start --web
```

## Veritabanı

Supabase üzerinde aşağıdaki tablolar oluşturulmuştur:

- `user_addictions` — Kullanıcı bağımlılık kayıtları
- `daily_logs` — Günlük check-in kayıtları
- `risk_scores` — AI risk skoru sonuçları
- `achievements` — Açılan başarımlar
- `notifications` — Bildirim kayıtları
- `support_centers` — Destek merkezi konumları (herkese açık)

Tüm kullanıcı tablolarında RLS (Row Level Security) etkindir. Her kullanıcı yalnızca kendi verilerine erişebilir.

## Güvenlik ve Etik

- Risk analizleri profesyonel tavisye yerine geçmez
- Veriler şifreli olarak saklanır, üçüncü kişilerle paylaşılmaz
- Başarımlar psikolojik baskı yaratmamak için pozitif psikoloji prensiplerine göre tasarlanmıştır
- Tasarruf hesaplamaları tahmini olup günlük maliyet alışkanlıklarına dayanır

## Lisans

MIT
