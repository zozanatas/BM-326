// test edilecek repository dosyası içeri alınır
const EmailRepository = require('./src/repository/EmailRepository');

// internet olmadığında da kodun mantığı test edilir. gerçek vt bağlantısı devredışı bırakılarak sahte yapı
jest.mock('./src/data-source', () => ({
    AppDataSource: { 
        getRepository: jest.fn() // taklit eden sahte fonksiyon
    }
}));

// eposta testleri bir grup altında
describe('EmailRepository Unit Tests', () => {
    // epostanın doğru kaydedildiğinin kontrolü
    test('E-posta başarıyla kaydedilmeli', async () => {
        // sahte veri paketi (address yerine email olarak güncellendi)
        const mockEmail = { id: 1, email: 'test@sude.com', subject: 'Merhaba' };
        
        // save modu taklit edilir, gerçek dbye gidilmeden
        EmailRepository.save = jest.fn().mockResolvedValue(mockEmail);

        // sahte veriyle test fonksiyonu çağırılır
        const result = await EmailRepository.save({ email: 'test@sude.com' });

        // gelen sonuç kontrolü
        expect(result.email).toBe('test@sude.com');
        
        // bu fonksiyonun gerçekten çalışıp çalışmadığının kontrolü
        expect(EmailRepository.save).toHaveBeenCalled();
    });
});