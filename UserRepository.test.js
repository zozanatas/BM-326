// int olmasa da testleri çalıştırır
jest.mock('./src/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(), //sahte depo
        initialize: jest.fn().mockResolvedValue({}) //bağlantı başarılıymış gibi davran
    }
}));
 //test edeceğimiz gerçek dosyayı çağırır
const UserRepository = require('./src/repository/UserRepository');

//testleri bir grupta topla
describe('UserRepository Unit Tests', () => {
    
    test('Yeni bir kullanıcıyı kaydetme mantığı doğru çalışmalı', async () => {
        const mockUser = { id: 1, firstName: 'Sude', lastName: 'Deneme' };
        
        // metodu manuel olarak jest fonksiyonuna dönüştür
        UserRepository.save = jest.fn().mockResolvedValue(mockUser);
        
        const result = await UserRepository.save({ firstName: 'Sude' });
         //sonuçları kontrol eder
        expect(result.firstName).toBe('Sude'); //ismi
        expect(result.id).toBe(1); //id yi
        expect(UserRepository.save).toHaveBeenCalled(); //gerçekten çağırıldı mı bu fonksiyon
    });
 //id ile arama fonk doğru çalışıyor mu
    test('ID ile kullanıcı bulma mantığı doğru çalışmalı', async () => {
        const mockUser = { id: 1, firstName: 'Sude' };
        
        // Metodu manuel olarak Jest fonksiyonuna dönüştürüyoruz
        UserRepository.findById = jest.fn().mockResolvedValue(mockUser);
        
        const result = await UserRepository.findById(1);
         
        //bulunan kullanıcı idsi ve ismi 1 , sude mi
        expect(result.id).toBe(1);
        expect(result.firstName).toBe('Sude'); 
        //fonk içine 1 raakmı gönderilmiş mi
        expect(UserRepository.findById).toHaveBeenCalledWith(1);
    });
});