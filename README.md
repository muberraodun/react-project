# Smart Maple React Developer Teknik Ödev - Geliştirme Raporu

Bu doküman, Smart Maple React Developer teknik ödevi kapsamında yapılan geliştirmeleri ve çözümleri başlıklar halinde açıklamaktadır.

---

## 🔧 ProfileCard Bileşeni – Rol Gösterimi Geliştirmesi

### 🎯 Amaç

Kullanıcı profili henüz yüklenmemişken `ProfileCard` bileşeninin hata vermesini engellemek ve rol bilgisinin güvenli şekilde gösterilmesini sağlamak.

### ✅ Yapılan Geliştirmeler

- ✨**`profile` prop'u opsiyonel hale getirildi**  
  `profile?: UserInstance` şeklinde tanımlandı. Böylece profil verisi mevcut olmasa bile bileşen hata vermeden çalışabiliyor.

- ✨**Rol bilgisi için fallback (yedek) değer eklendi**  
  `profile?.role ?? AuthSession.getRoles()` kullanılarak, profil verisi gelmemişse `localStorage` üzerinden rol bilgisi alınarak gösterim sağlandı.

- ✨**Güvenli `roleValue` erişimi eklendi**  
  `roleValue` hem nesne (`{ name: "Admin" }`) hem de string (`"Admin"`) olabildiği için, `.name` özelliğine erişmeden önce tür kontrolü yapıldı. Böylece runtime hataları engellendi.

### 🧩 Sonuç

Bu geliştirmeler sayesinde:

- Profil verisi eksik olsa bile `ProfileCard` bileşeni sorunsuz çalışır.
- Kullanıcının rol bilgisi doğru şekilde gösterilir.
- Uygulama hata vermez, güvenli ve kararlı bir yapı sağlanmış olur.

---

## 📅 Takvim Başlangıç Tarihi ve Event Detayı Geliştirmesi

### 🎯 Amaç

Takvimin, schedule verisindeki ilk etkinliğin tarihine göre başlamasını sağlamak ve takvimdeki etkinliklere tıklanıldığında, ilgili etkinlik bilgilerini gösteren bir pop-up eklemek.

### ✅ Yapılan Geliştirmeler

- ✨**`initialDate` durumunun değiştirilmesi**  
  `initialDate` durumu başlangıçta `null` olarak ayarlandı. Böylece takvim, başlangıçta bir tarih göstermez ve schedule verisi yüklendikten sonra doğru tarihe göre başlar.

- ✨**`selectedEvent` ve `isModalOpen` durumlarının eklenmesi**  
  - `selectedEvent`: Seçilen etkinliğin detaylarını tutar (personel adı, vardiya adı, tarih, başlangıç ve bitiş saatleri gibi).
  - `isModalOpen`: Etkinlik tıklandığında bir pop-up açılıp kapanmasını kontrol eder.

- ✨**`handleEventClick` fonksiyonu ve pop-up işlevi**  
  - Takvimdeki bir etkinlik tıklandığında `handleEventClick` fonksiyonu etkinlik verilerini alır ve `selectedEvent` state'ine kaydeder.
  - Pop-up'ı açmak için `setIsModalOpen(true)` çağrısı yapılır. Pop-up kapatıldığında `closeModal` fonksiyonu devreye girer.

- ✨**`useEffect` ile takvimin dinamik güncellenmesi**  
  - `useEffect`, schedule verisi güncellendiğinde ilk olarak varsayılan personeli seçer ve bu personele ait etkinlikleri takvime işler.
  - Takvim, personel değiştirildiğinde o personele ait etkinliklerin bulunduğu aydan başlar.

### 🧩 Sonuç

- Takvim, schedule verisindeki ilk etkinliğin tarihine göre başlar.
- Kullanıcılar, takvimdeki etkinliklere tıkladıklarında etkinlik detaylarını pop-up içinde görebilirler.
- Takvim ve etkinlikler dinamik olarak güncellenir, böylece kullanıcı deneyimi geliştirilmiş olur.

---

## 👥 Personel Bazlı Etkinlik Filtreleme Geliştirmesi

### 🎯 Amaç

Takvimde yalnızca seçilen personelin etkinliklerini göstermek, böylece tüm personellerin görevlerinin yerine sadece seçilen personelin görevlerinin takvimde görünmesini sağlamak.

### ✅ Yapılan Geliştirmeler

- ✨**`generateStaffBasedCalendar` fonksiyonunun güncellenmesi**  
  `generateStaffBasedCalendar` fonksiyonu, artık yalnızca seçilen personelin görevlerini (personel bazlı) filtreleyerek takvime ekliyor. Bu sayede yalnızca ilgili personelin etkinlikleri takvimde gösteriliyor.

### 🧩 Sonuç

- Takvimde sadece seçilen personelin etkinlikleri görüntülenir.
- Önceden tüm personellerin etkinliklerinin görünmesi durumu ortadan kalkarak daha iyi bir kullanıcı deneyimi sağlanmıştır.

---

## 🎨 Takvimde Seçilen Personelin Pair Günlerinin Renkli, Belirgin Gösterimi

### 🎯 Amaç
Takvimde yalnızca **seçilen personelin** pair günlerinin (başka bir personelle birlikte çalıştığı günlerin), **ilgili personelin rengiyle altı çizili olarak** gösterilmesini sağlamak.

### ✅ Yapılan Geliştirmeler

- ✨**`checkPairsForStaff` fonksiyonunun eklenmesi ve geliştirilmesi**
  - Seçilen personelin pair listesindeki tarih aralıklarını kontrol eder.
  - Belirli bir günün **pair günü** olup olmadığını tespit eder.
  - Eğer gün bir pair günü ise, **ilgili personelin rengini** döndürür.

- ✨**`CalendarView` bileşeninde `dayCellContent` güncellenmesi**
  - Takvim hücrelerinin içeriği güncellenirken artık her gün için **pair kontrolü** yapılmaktadır.
  - Pair günü olan hücrelerde:
    - İlgili personelin **rengiyle altı çizgi**,
    - **Personelin baş harfini** içeren bir görsel gösterge eklenir.

- ✨**CSS stillerinde yapılan geliştirmeler**
  - Yeni sınıflar eklenerek görsel göstergeler tanımlandı.
  - Her personel için farklı renkler kullanılarak, **hangi personelle pair olunduğu** hızlıca görülebilir hale getirildi.

### 🧩 Sonuç
  - Takvimde artık yalnızca **seçilen personelin pair günleri** altı çizili olarak görüntülenmektedir.
  - Her pair, **ilgili personelin rengiyle** gösterilmektedir.
  - Önceki durumda tüm günlerin altı çizili olması sorunu giderilerek, **daha temiz ve anlaşılır bir takvim görünümü** sağlanmıştır.

---

## 🗓️ Takvimde Sürükle-Bırak Özelliği Geliştirmesi

### 🎯 Amaç  
Takvim üzerindeki etkinliklerin **sürükle-bırak** işlevi ile günlerinin değiştirilebilmesi ve bu değişikliklerin **Redux state** yapısına doğru şekilde yansıtılmasını sağlamak.

### ✅ Yapılan Geliştirmeler

- ✨**Redux Actions, Redux Reducer Yapısı**
  - `schedule/actions.ts` dosyasında `updateAssignment` action'ı tanımlandı.  
  - Bu action, etkinliğin **yeni tarih bilgisini** alarak state güncellemesini başlatır.
  - `schedule/index.ts` reducer'ına `UPDATE_ASSIGNMENT` case'i eklendi.  

- ✨**Calendar Component Entegrasyonu**
  - `CalendarContainer` içinde `handleEventDrop` fonksiyonu oluşturuldu.  
  - Bu fonksiyon, sürükleme sonrası **yeni tarih bilgisi** ile birlikte `dispatch` işlemini gerçekleştirir.  
  - Etkinlik ID'si ve yeni tarihi, action'a parametre olarak iletilir.

- ✨**Görsel Geri Bildirim**
    - Güncellenen etkinlikler için CSS sınıfı tanımlandı.  
  - `highlight` sınıfı ile etkinliğin köşelerinde görsel işaretler gösterildi.  
  - Etkinlik detay modalında, `isUpdated` durumuna göre "**Güncellendi**" bilgisi eklendi.

## 🧩 Sonuç
Bu geliştirmeler sayesinde:

- Kullanıcılar etkinlikleri takvimde sürükleyerek kolayca tarihlerini değiştirebilir.  
- Yapılan değişiklikler anında **Redux state**'e yansır ve uygulamanın tümünde geçerli olur.  
- **Görsel geri bildirimler** sayesinde güncellenmiş etkinlikler kolayca ayırt edilebilir.  
- State yönetimi ile değişiklikler **sayfa geçişlerinde bile korunur**.

---

## 📝 Not: Redux Kullanımı Hakkında
Bu proje kapsamında, Context API gibi daha hafif state yönetim çözümleri teknik olarak yeterli olabilirdi. Ancak **uygulamanın ileride genişleme ihtimali** ve **state yönetiminin ölçeklenebilirliği** göz önünde bulundurularak Redux tercih edildi.  

Bu sayede:

- Daha karmaşık veri akışları daha net ve yönetilebilir hale getirildi,  
- Geliştirme ve hata ayıklama süreçleri kolaylaştırıldı (Redux DevTools vb.),  
- Potansiyel ekip çalışmalarında tutarlı ve merkezi bir yapı sağlanmış oldu.

---

## 🎨 Tasarım Güncellemeleri

### 🎯 Amaç  
Uygulamanın görsel ve yapısal tasarımını modernize ederek kullanıcı deneyimini iyileştirmek ve daha estetik bir arayüz sunmak.

### ✅ Yapılan Geliştirmeler

- ✨**Renk Sistemi ve Görsel Kimlik**
    - Tutarlı renk paleti oluşturuldu (mor-mavi gradyan ana tema olarak benimsendi).
  - Renkler erişilebilirlik standartlarına uygun hale getirildi.

- ✨**Takvim Arayüzü İyileştirmeleri**
  - Takvim hücreleri daha okunaklı ve ferah bir tasarıma kavuşturuldu.
  - Navigasyon butonları yeniden tasarlandı.
  - Etkinlik kartları ve bilgileri için daha belirgin tasarım uygulandı.
  - Hover ve aktif durum animasyonları eklenerek kullanıcı etkileşimi artırıldı.
  - Personel eşleştirmelerini gösteren görsel öğeler için tooltip sistemi eklendi.

- ✨**Popup/Modal Tasarım İyileştirmeleri**
  - EventDetailsModal için gradyan başlık ve modern tasarım uygulandı.
  - Popup'lara giriş/çıkış animasyonları eklenerek kullanıcı deneyimi iyileştirildi.
  - Buton tasarımları daha belirgin ve tıklanabilir hale  getirildi.
  - Popup içeriği yeniden düzenlendi.

- ✨**Admin Profil Kartı**
  - Profil kartı için gradyan arka plan ve modern tasarım uygulandı.
  - Kullanıcı adı, rol ve departman bilgileri daha okunaklı şekilde yeniden düzenlendi.
  - Profil bilgilerini taşıyan kartlar için hover efektleri eklendi.

## 🧩 Sonuç  
Yapılan tasarım güncellemeleri sayesinde:

- Uygulama daha modern ve profesyonel bir görünüme kavuştu.
- Kullanıcı deneyimi zenginleştirildi ve etkileşim kalitesi arttı.
- Bilgi hiyerarşisi daha net hale getirilerek kullanıcıların bilgiye erişimi kolaylaştırıldı.
- Görsel tutarlılık sağlandı.
