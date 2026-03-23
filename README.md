Ne Pişirsem? (Frontend)

Kullanıcının elindeki malzemelere göre yemek öneren bir React uygulaması.

Bu proje, Django backend ile entegre çalışan bir fullstack uygulamanın frontend tarafıdır.

---

Özellikler

- Kullanıcıdan malzeme girişi alma
- Malzemeleri liste (chips) olarak yönetme
- Backend API’ye istek atarak öneri alma
- Gelen tarifleri listeleme
- Tarif detaylarını modal ile görüntüleme

---

 Mimari

Frontend tarafı sadece UI ve API iletişimi ile ilgilenir.

```text
User Input
→ React State (ingredients)
→ POST /api/recipes/suggest/
→ Django Backend
→ JSON Response
→ UI Render
