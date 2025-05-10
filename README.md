# Smart Maple React Developer Teknik Ödev - Geliştirme Raporu

Bu doküman, Smart Maple React Developer teknik ödevi kapsamında yapılan geliştirmeleri ve çözümleri başlıklar halinde açıklamaktadır.

## 🔧 ProfileCard Bileşeni – Rol Gösterimi Geliştirmesi

### 🎯 Amaç

Kullanıcı profili henüz yüklenmemişken `ProfileCard` bileşeninin hata vermesini engellemek ve rol bilgisinin güvenli şekilde gösterilmesini sağlamak.

### ✅ Yapılan Geliştirmeler

- **`profile` prop'u opsiyonel hale getirildi**  
  `profile?: UserInstance` şeklinde tanımlandı. Böylece profil verisi mevcut olmasa bile bileşen hata vermeden çalışabiliyor.

- **Rol bilgisi için fallback (yedek) değer eklendi**  
  `profile?.role ?? AuthSession.getRoles()` kullanılarak, profil verisi gelmemişse `localStorage` üzerinden rol bilgisi alınarak gösterim sağlandı.

- **Güvenli `roleValue` erişimi eklendi**  
  `roleValue` hem nesne (`{ name: "Admin" }`) hem de string (`"Admin"`) olabildiği için, `.name` özelliğine erişmeden önce tür kontrolü yapıldı. Böylece runtime hataları engellendi.

### 🧩 Sonuç

Bu geliştirmeler sayesinde:

- Profil verisi eksik olsa bile `ProfileCard` bileşeni sorunsuz çalışır.
- Kullanıcının rol bilgisi doğru şekilde gösterilir.
- Uygulama hata vermez, güvenli ve kararlı bir yapı sağlanmış olur.
