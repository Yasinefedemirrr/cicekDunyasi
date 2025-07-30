# Çiçek Dünyası - Çiçek Satış Websitesi

Bu proje, Clean Architecture ve Onion Architecture prensiplerine uygun olarak geliştirilmiş bir çiçek satış websitesidir.

## Proje Yapısı

### Backend (.NET 8)
- **ÇiçekDünyası.API**: Web API katmanı
- **ÇiçekDünyası.Application**: Uygulama iş mantığı katmanı
- **ÇiçekDünyası.Domain**: Domain modelleri ve iş kuralları
- **ÇiçekDünyası.Infrastructure**: Veritabanı ve dış servisler

### Frontend (React + TypeScript)
- **ÇiçekDünyası.Web**: Kullanıcı ve admin arayüzleri

## Özellikler

- JWT Token tabanlı kimlik doğrulama
- Admin ve kullanıcı arayüzleri
- Çiçek katalog sistemi
- Sepet yönetimi
- Sipariş oluşturma ve takip
- Admin paneli ile sipariş yönetimi

## Kurulum

### Backend
```bash
cd src/ÇiçekDünyası.API
dotnet restore
dotnet run
```

### Frontend
```bash
cd src/ÇiçekDünyası.Web
npm install
npm start
```

## Teknolojiler

- **Backend**: .NET 8, Entity Framework Core, JWT
- **Frontend**: React, TypeScript, Material-UI
- **Database**: SQL Server
- **Architecture**: Clean Architecture, Onion Architecture 