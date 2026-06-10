// popup.js'ten gelen komutları dinleyen ana fonksiyon
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    // 1. Gelen e-posta metnini okuma (AEPMYA-18)
    if (request.action === "getEmailContent") {
        try {
            // Gmail'in güncel HTML sınıflarına (class) göre e-posta gövdesini ve konusunu seçiyoruz
            const subjectElement = document.querySelector('h2.hP'); 
            const contentElements = document.querySelectorAll('.a3s.aiL'); 
            const senderElement = document.querySelector('span.gD');

            const subject = subjectElement ? subjectElement.innerText : "Konu Bulunamadı";
            const senderEmail = senderElement ? senderElement.getAttribute('email') : "bilinmeyen_kullanici@mail.com";
            
            let content = "";
            // Genelde bir mail zincirinde birden fazla mesaj olur, biz en sonuncuyu (en alttakini) alıyoruz
            if (contentElements.length > 0) {
                content = contentElements[contentElements.length - 1].innerText;
            }

            // Bilgileri popup.js'e geri gönder
            sendResponse({ success: true, subject, content, senderEmail });
        } catch (error) {
            sendResponse({ success: false, error: "E-posta içeriği okunamadı." });
        }
    } 
    
    // 2. Üretilen yanıtı e-posta kutusuna otomatik yazma (AEPMYA-23)
    else if (request.action === "insertReply") {
        // Gmail'in cevap yazma alanı 'role="textbox"' olan bir div'dir
        const replyBox = document.querySelector('div[role="textbox"]');
        
        if (replyBox) {
            // Yanıt metnindeki alt satıra geçişleri HTML <br> etiketine çevirip kutuya basıyoruz
            replyBox.innerHTML = request.replyText.replace(/\n/g, '<br>');
            
            // Gmail'in (React altyapısının) değişikliği algılayıp "Gönder" butonunu aktif etmesi için event tetikliyoruz
            replyBox.dispatchEvent(new Event('input', { bubbles: true }));
            
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false, error: "Lütfen önce Gmail'de 'Yanıtla' butonuna tıklayarak cevap kutusunu açın." });
        }
    }

    return true; // Asenkron işlemler için true dönmek zorunludur
});