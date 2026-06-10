document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const insertBtn = document.getElementById('insert-btn');
    const resultContainer = document.getElementById('result-container');
    const statusText = document.getElementById('status');
    const replyTextArea = document.getElementById('reply-text');
    const tagsContainer = document.getElementById('tags');

    // 1. Analiz Butonu İşlemleri (Backend ve Content Script Bağlantısı)
    analyzeBtn.addEventListener('click', async () => {
        statusText.textContent = "Gmail'den veri okunuyor...";
        analyzeBtn.disabled = true;
        resultContainer.style.display = 'none';

        // Aktif sekmedeki content.js'e mesaj gönderip mail içeriğini al
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "getEmailContent"}, async function(response) {
                
                if (!response || !response.success) {
                    statusText.textContent = "Hata: Lütfen bir e-posta içerisindeyken deneyin.";
                    analyzeBtn.disabled = false;
                    return;
                }

                statusText.textContent = "Yapay zeka e-postayı analiz ediyor...";

                try {
                    // Node.js Backend API'sine istek atıyoruz
                    // Not: Projeyi ayağa kaldırdığınız port 3000 değilse burayı güncelleyin.
                    const apiResult = await fetch('http://localhost:3000/api/emails/process', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: 1, // Sistemde kayıtlı varsayılan bir user id
                            email: response.senderEmail,
                            subject: response.subject,
                            content: response.content
                        })
                    });

                    const responseData = await apiResult.json();

                    if (responseData.success) {
                        // Backend'den dönen AI verisini ekrana bas
                        console.log("Backend yanıtı:", JSON.stringify(responseData));
                        const replyData = responseData.data?.suggestedReply 
                            || responseData.suggestedReply 
                            || responseData.data?.replyContent
                            || responseData.data
                            || responseData;
                        displayResults(replyData);
                        statusText.textContent = "Analiz başarıyla tamamlandı.";
                    } else {
                        statusText.textContent = "Sunucu Hatası: " + responseData.message;
                    }
                } catch (error) {
                    console.error("Fetch API Hatası:", error);
                    statusText.textContent = "Backend'e bağlanılamadı. Node.js sunucusu açık mı?";
                } finally {
                    analyzeBtn.disabled = false;
                }
            });
        });
    });

    // 2. Sonuçları Ekrana Yazdırma ve Etiketleme Fonksiyonu
    function displayResults(data) {
        tagsContainer.innerHTML = '';

        // Eğer data string olarak geldiyse, objeye çevir
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch(e) {
                // Parse edilemiyorsa direkt yanıt olarak kullan
                replyTextArea.value = data;
                resultContainer.style.display = 'block';
                return;
            }
        }
        
        // Etiket oluşturucu yardımcı fonksiyon
        const createTag = (text, color) => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.style.backgroundColor = color;
            span.textContent = text;
            return span;
        };

        // Etiket renklerini dinamiğe bağlama
        const oncelikRenk = (data.oncelik && data.oncelik.toLowerCase().includes('acil')) ? '#dc3545' : '#17a2b8';
        
        if(data.oncelik) tagsContainer.appendChild(createTag(data.oncelik, oncelikRenk));
        if(data.duygu) tagsContainer.appendChild(createTag(data.duygu, '#6f42c1'));
        if(data.kategori) tagsContainer.appendChild(createTag(data.kategori, '#fd7e14'));

        replyTextArea.value = data.yanit || data.replyContent || data.reply_draft || (typeof data === 'string' ? data : "Yanıt oluşturulamadı.");
        resultContainer.style.display = 'block';
    }

    // 3. E-postaya Ekle Butonu İşlemleri (DOM Injection)
    insertBtn.addEventListener('click', () => {
        const textToInsert = replyTextArea.value;
        statusText.textContent = "E-postaya aktarılıyor...";
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "insertReply", replyText: textToInsert }, function(response) {
                if (response && response.success) {
                    statusText.textContent = "Başarıyla e-postaya aktarıldı!";
                } else {
                    statusText.textContent = response ? response.error : "Aktarım hatası! Yanıtla kutusu açık mı?";
                }
            });
        });
    });
});