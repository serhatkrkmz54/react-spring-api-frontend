import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Futbolcuları PlayersResource rest controllerden getiren kod.

export const getFutbolcular = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/playerss`);
      return response.data.reverse();
    } catch (error) {
      console.error("Veri getirilirken hata oluştu:", error);
      throw error;
    }
  };

// Futbolcuları PlayersResource rest controllerden getiren kod.

// Takımları TeamsResource rest controllerden getiren kod.

export const getTakimlar = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/teamss`);
        return response.data.map((takim: any) => ({ id: takim.id, tName: takim.tName }));
    } catch (error) {
        console.error("Takım verisi getirilirken hata oluştu:", error);
        throw error;
    }
};

// Takımları TeamsResource rest controllerden getiren kod.

// Ülkeleri CountryResource rest controllerden getiren kod.

export const getUlkeler = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/countries`);
      return response.data.map((ulke:any) => ({ id: ulke.id, cName: ulke.cName }));
    } catch (error) {
      console.error("Ülke verisi getirilirken hata oluştu:", error);
      throw error;
    }
  };

// Ülkeleri CountryResource rest controllerden getiren kod.

// Oyuncu Ekleme kısmı buradan yapılıyor.

  export const postFutbolcu = async (formData:any) => {
    try {
      const response = await axios.post(`${BASE_URL}/playerss`, formData, {
        timeout: 500,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Hata oluştu:', error);
      throw error;
    }
  };
  
// Oyuncu Ekleme kısmı buradan yapılıyor.

// Oyuncu Silme kısmı buradan yapılıyor.

export const deleteFutbolcu = async (id:any) => {
  try {
    await axios.delete(`${BASE_URL}/playerss/${id}`);
  } catch (error) {
    console.error("Oyuncu silinirken hata oluştu:", error);
    throw error;
  }
};

// Oyuncu Silme kısmı buradan yapılıyor.

// Toplam Oyuncu Değeri buradan geliyor.Springte PlayersResource'de oyuncuToplamDeger mappingi ile geliyor.

export const getToplamOyuncuDegeri = async () => {
  try {
    const response = await fetch(`${BASE_URL}/playerss/oyuncuToplamDeger`);
    const veri = await response.json();
    return veri;
  } catch (error) {
    console.error('Veri alınırken hata oluştu:', error);
    throw error;
  }
};

// Toplam Oyuncu Değeri buradan geliyor.Springte PlayersResource'de oyuncuToplamDeger mappingi ile geliyor.
