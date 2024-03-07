'use client';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { use, useEffect, useState, useRef } from 'react';
import type { Demo } from '@/types';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import * as api from '../../../api/SpringAxios';


const PlayersGet = () => {
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [loading1, setLoading1] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [futbolcular, setFutbolcular] = useState<Demo.Futbolcu[]>([]);
    const [visible, setVisible] = useState(false);
    const [takimlar, setTakimlar] = useState<Demo.Takim[]>([]);
    const [oyuncuDegeri, setOyuncuDegeri] = useState<string | null>(null);
    const [ulkeler,setUlkeler] = useState<Demo.Ulkeler[]>([]);
    const toast = useRef(null);


    const showToast = (severity:any, summary:any, detail:any,life:any) => {
        toast.current.show({ severity, summary, detail, life });
      };
    
    const clearFilter1 = () => {
        initFilters1();
    };

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between items-center m">
                <div>
                <Button label="Futbolcu Ekle" icon="pi pi-external-link" className="p-button-success" onClick={() => setVisible(true)} style={{ marginRight: '8px' }} />
                <Button type="button" icon="pi pi-filter-slash" label="Temizle" outlined onClick={clearFilter1}  />
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Kelimeyi arayın" />
                </span>
            </div>
        );
    };

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'pName': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN }
        });
        setGlobalFilterValue1('');
    };


    //Futbolcuların verilerini getiren kod parçası
    useEffect(() => {
        const loadFutbolcular = async () => {
          try {
            const futbolcularData = await api.getFutbolcular();
            setFutbolcular(futbolcularData);
          } catch (error) {
            console.error("Veri getirilirken hata oluştu:", error);
          } finally {
            setLoading1(false);
          }
        };
        loadFutbolcular();
        initFilters1();
      }, []);
    //Futbolcuların verilerini getiren kod parçası

      //Takımları getiren kod parçası
      useEffect(() => {
        const loadTakimlar = async () => {
          try {
            const takimlarData = await api.getTakimlar();
            setTakimlar(takimlarData);
          } catch (error) {
            console.error("Takım verisi getirilirken hata oluştu: ", error);
          }
        };
        loadTakimlar();
      }, []);
      //Takımları getiren kod parçası

      //Ülkeleri getiren kod parçası

      useEffect(() => {
        const loadUlkeler = async () => {
          try {
            const ulkelerData = await api.getUlkeler();
            setUlkeler(ulkelerData);
          } catch (error) {
            console.error("Ülke verisi getirilirken hata oluştu: ", error);
          }
        };
        loadUlkeler();
      }, []);

      //Ülkeleri getiren kod parçası

      //Base64 formatındaki resmi gösteren kod parçası
      const renderImage = (base64Data: string) => {
        return <div style={{
        borderRadius: '50%',
        overflow: 'hidden',
        width: '50px',
        height: '50px'}}>
          <img src={`data:image/png;base64,${base64Data}`} alt="Oyuncu Fotoğrafı" style={{ width: '100%', height: '100%' }} />
        </div>;
      };
      //Base64 formatındaki resmi gösteren kod parçası

      const formatPValue = (value: string) => {
        const numericValue = parseFloat(value.replace(/[.,]/g, '').replace(',', '.'));
    
        if (!isNaN(numericValue)) {
            let formattedValue: string;
    
            if (numericValue >= 1000000) {
                formattedValue = `${(numericValue / 1000000).toFixed(2)} Milyon`;
            } else if (numericValue >= 1000) {
                formattedValue = `${(numericValue / 1000).toFixed(2)} Bin`;
            } else {
                formattedValue = numericValue.toFixed(2);
            }
    
            return `€${formattedValue}`;
        } else {
            return 'Geçerli bir değer yok';
        }
    };

            // Toplam oyuncu değerini getiren kod parçası

            useEffect(() => {
                const dataParcala = async () => {
                  try {
                    const oyuncuDegeri = await api.getToplamOyuncuDegeri();
                    setOyuncuDegeri(oyuncuDegeri);
                  } catch (error) {
                    console.error('Veri alınırken hata oluştu:', error);
                  }
                };
                dataParcala();
              }, []);
              
            // Toplam oyuncu değerini getiren kod parçası

            // Toplam oyuncu değerini formatlama kısmı

            const formattedOyuncuDegeri: string = (parseFloat(oyuncuDegeri as string) >= 1000000)
            ? `${(parseFloat(oyuncuDegeri as string) / 1000000).toFixed(2)} Milyon`
            : (parseFloat(oyuncuDegeri as string) >= 1000)
                ? `${(parseFloat(oyuncuDegeri as string) / 1000).toFixed(2)} Bin`
                : `${parseFloat(oyuncuDegeri as string).toFixed(2)}`;

            // Toplam oyuncu değerini formatlama kısmı

            // Girilecek oyuncu sayısını hesapla

            const girilecekOyuncu = 2345;
            const kalanOyuncuSayisi = girilecekOyuncu - futbolcular.length;

            // Girilecek oyuncu sayısını hesapla

           //Futbolcu Ekleme tanımlamaları

           const [adi, setAdi] = useState('');
           const [soyadi, setSoyadi] = useState('');
           const [uyruk, setUyruk] = useState('');
           const [kilo, setKilo] = useState<number>();
           const [boy, setBoy] = useState<number>();
           const [mevki, setMevki] = useState('');
           const [yas, setYas] = useState<number>();
           const [deger, setDeger] = useState<number>();
           const [ayak, setAyak] = useState('');
           const [selectedTeam, setSelectedTeam] = useState<Demo.Takim | null>(null);
           const [selectedCountry, setSelectedCountry] = useState<Demo.Ulkeler | null>(null);
           const fileUploadRef = useRef<HTMLInputElement | null>(null);
           const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
           const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
           const [hasError, setHasError] = useState(false);
           
           const handleSubmit = async (e:React.FormEvent) => {
            e.preventDefault();
        
            try {
              const formData = new FormData();
              formData.append('pName', adi);
              formData.append('pSurname', soyadi);
              formData.append('pCountry', uyruk);
              formData.append('pWeight', kilo?.toString() || '');
              formData.append('pHeight', boy?.toString() || '');
              formData.append('pPosition', mevki);
              formData.append('pPlayerAge', yas?.toString() || '');
              formData.append('pValue', deger?.toString() || '');
              formData.append('pFoot', ayak);
              formData.append('toTeams', selectedTeam?.toString() || '');
              formData.append('toCountryPlayers', selectedCountry?.toString() || '');
        
              // Dosya ekleme
              const fileInput = fileUploadRef.current?.files?.[0];
              if (fileInput) {
                formData.append('pathFile', fileInput, fileInput.name);
              }
        
              await api.postFutbolcu(formData);
              setVisible(false);
              showToast('success', 'Başarı', 'Futbolcu başarıyla eklendi!', 5000);
            } catch (error) {
              showToast('error', 'Hata', 'Futbolcu eklenirken bir hata oluştu.', 5000);
              console.error('Hata oluştu:', error);
            }
          };

           const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
        
            if (file) {
              const data = new FormData();
              data.append('photo', file);

              const options = {
                method: 'POST',
                url: 'https://face-detection11.p.rapidapi.com/FaceDetection',
                headers: {
                  'X-RapidAPI-Key': '156fd61e29mshaa93cb83e034120p15c61bjsnc9047a4ba381',
                  'X-RapidAPI-Host': 'face-detection11.p.rapidapi.com'
                },
                data: data
              };
              try {
                const response = await axios.request(options);
                setHasError(response.data.hasError);
                if(response.data.hasError===true){
                  showToast('error', 'Hata', 'Bu surata benziyomu aq', 5000);
                }else {
                  showToast('success', 'Başarılı', 'Yüz algılandı, işleminize devam edebilirsiniz.', 5000);
                }
              } catch (error) {
                console.error(error);
              }
              setSelectedFile(file);
              const reader = new FileReader();
              reader.onloadend = () => {
                setPreviewImage(reader.result as string);
              };
              reader.readAsDataURL(file);
            } else {
              setSelectedFile(undefined);
              setPreviewImage(undefined);
            }
          };
        
              const formTamanlanmismi = () => {
                return !adi || !soyadi || !uyruk || kilo === null || boy === null || !mevki || yas === null || deger === null || !ayak || hasError===true ;
              };

            //Futbolcu Ekleme tanımlamaları
            
            //Futbolcu silme tanımlamaları

            const oyuncuyuSil = async (id:number) => {
                const confirmDialogOptions = {
                  message: 'Futbolcuyu silmek istediğinizden emin misiniz?',
                  header: 'Futbolcuyu Sil',
                  icon: 'pi pi-info-circle',
                  acceptClassName: 'p-button-danger',
                  accept: async () => {
                    try {
                      await api.deleteFutbolcu(id);
                      const updatedFutbolcular = futbolcular.filter((player) => player.id !== id);
                      setFutbolcular(updatedFutbolcular);
                      showToast('success', 'Başarı', 'Futbolcu başarıyla kaldırıldı!', 5000);
                    } catch (error) {
                      console.error('Oyuncu silinirken hata oluştu:', error);
                      showToast('error', 'Hata', 'Futbolcu kaldırılırken bir hata oluştu.', 5000);
                    }
                  },
                };
                confirmDialog(confirmDialogOptions);
              };

            //Futbolcu silme tanımlamaları

    const header1 = renderHeader1();

    return (
        <div className="grid">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0 h-12rem">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Toplam Oyuncu Verisi</span>
                            <div className="text-900 font-medium text-xl">{futbolcular.length}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-cloud text-orange-500 text-xl" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <img src="https://img.a.transfermarkt.technology/portrait/big/28396-1696447661.png?lm=1" alt="" style={{ width: '35px', height: '40px', borderRadius: '50%', overflow: 'hidden', display: 'block', marginRight: '-18px' }}/>
                        <img src="https://img.a.transfermarkt.technology/portrait/big/28003-1694590254.jpg?lm=1" alt="" style={{ width: '35px', height: '40px', borderRadius: '50%', overflow: 'hidden', display: 'block', marginRight: '-18px' }}/>
                        <img src="https://img.a.transfermarkt.technology/portrait/big/8198-1694609670.jpg?lm=1" alt="" style={{ width: '35px', height: '40px', borderRadius: '50%', overflow: 'hidden', display: 'block', marginRight: '-18px' }}/>
                        <img src="https://img.a.transfermarkt.technology/portrait/big/191614-1698609730.png?lm=1" alt="" style={{ width: '35px', height: '40px', borderRadius: '50%', overflow: 'hidden', display: 'block', marginRight: '-18px' }}/>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0 h-12rem">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Toplam Oyuncu Değeri</span>
                            <div className="text-900 font-medium text-xl">€{formattedOyuncuDegeri}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-euro text-black-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">%52+ </span>
                    <span className="text-500">geçen haftadan bu yana</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0 h-12rem">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Girilecek Toplam Oyuncu</span>
                            <div className="text-900 font-medium text-xl">{kalanOyuncuSayisi}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-check text-orange-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            <Dialog header="Futbolcu Ekle" visible={visible} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal className="p-fluid" onHide={() => setVisible(false)}>
            <form onSubmit={handleSubmit}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '20px ' }}>
                <input type="file" accept="image/*" ref={fileUploadRef} onChange={handleFileChange} />
                    {selectedFile && (
                        <div>
                        {previewImage && (<img src={previewImage} alt="Dosya Önizleme" style={{ maxWidth: '100px', maxHeight: '70px', borderRadius: '50%', marginLeft: '10px' }} /> )}
                        </div>
                    )}
                    </div>
                 <div className="field">
                    <label htmlFor="pName" className="font-bold">
                        Adı
                    </label>
                    <InputText id="pName" placeholder="Adını giriniz" value={adi} onChange={(e) => setAdi(e.target.value)} aria-describedby="username-help" />
                    
                </div>
                <div className="field">
                    <label htmlFor="pSurname" className="font-bold">
                        Soyadı
                    </label>
                    <InputText id="pSurname" placeholder="Soyadını giriniz" value={soyadi} onChange={(e) => setSoyadi(e.target.value)} aria-describedby="username-help" />
                </div>
                <div className="field">
                    <label htmlFor="pCountry" className="font-bold">
                        Uyruk
                    </label>
                    <InputText id="pCountry" placeholder="Uyruk giriniz" value={uyruk} onChange={(e) => setUyruk(e.target.value)} aria-describedby="username-help" />
                </div>
                <div className="field">
                    <label htmlFor="pWeight" className="font-bold">
                        Kilosu
                    </label>
                    <InputNumber inputId="withoutgrouping" value={kilo} onValueChange={(e: InputNumberValueChangeEvent) => setKilo(e.value)} useGrouping={false}  placeholder="Kilosunu giriniz"/>
                </div>
                <div className="field">
                    <label htmlFor="pHeight" className="font-bold">
                        Boyu
                    </label>
                    <InputNumber inputId="withoutgrouping" value={boy} showButtons min={0} max={300} onValueChange={(e: InputNumberValueChangeEvent) => setBoy(e.value)} placeholder="Boyunu girin" useGrouping={false} />
                </div>
                <div className="field">
                    <label htmlFor="pPosition" className="font-bold">
                        Mevkisi
                    </label>
                    <InputText id="pPosition" placeholder="Mevkisini giriniz" value={mevki} onChange={(e) => setMevki(e.target.value)} aria-describedby="username-help" />
                </div>
                <div className="field">
                    <label htmlFor="pPlayerAge" className="font-bold">
                        Yaşı
                    </label>
                    <InputNumber inputId="withoutgrouping" placeholder="Yaşını girin" value={yas} onValueChange={(e: InputNumberValueChangeEvent) => setYas(e.value)} useGrouping={false} />
                </div>
                <div className="field">
                    <label htmlFor="pValue" className="font-bold">
                        Piyasa Değeri
                    </label>
                    <InputNumber value={deger} onValueChange={(e) => setDeger(e.value)} placeholder="Örnek: €50,000 <== Bin, €1,000,000 <= Milyon"/>
                </div>
                <div className="field">
                    <label htmlFor="pFoot" className="font-bold">
                        Oynadığı Ayak
                    </label>
                    <InputText id="pFoot" placeholder="Oynadığı ayak bilgisini giriniz" value={ayak} onChange={(e) => setAyak(e.target.value)} aria-describedby="username-help" />
                </div>
                <div className="field">
                    <label htmlFor="oyuncuHangiTakimda" className="font-bold">
                        Oynadığı Takım
                    </label>
                    <ListBox
                    filter
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.value)}
                    options={takimlar} 
                    optionValue="id"
                    optionLabel="tName" 
                    className="w-full md:w-35rem"
                    listStyle={{ maxHeight: '250px' }}
                    />
                </div>
                <div className="field">
                    <label htmlFor="oyuncuHangiUlkede" className="font-bold">
                        Milli Takımı
                    </label>
                    <Dropdown optionLabel="cName" 
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.value)}
                    options={ulkeler}
                    optionValue="id"
                showClear placeholder="Milli Takım Seçiniz" className="w-full md:w-35rem" />
                </div>
                <div className="field">
                <Button label="Oyuncuyu Ekle" disabled={formTamanlanmismi()} onClick={handleSubmit} severity="success" />
                </div>
                </form>
            </Dialog>

            <div className="col-12">
                <div className="card">
                    <h5>Oyuncu Listesi</h5>
                    <DataTable
                        value={futbolcular}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filters={filters1}
                        filterDisplay="menu"
                        loading={loading1}
                        emptyMessage="Oyuncu Bulunamadı."
                        header={header1}
                    >                        
                        <Column field="id" header="ID" style={{ minWidth: '8rem', fontWeight: 'bold'}} />
                        <Column field="filePath" body={(rowData: Demo.Futbolcu) => renderImage(rowData.filePath)} header="Fotoğraf" style={{ minWidth: '5rem' }} />
                        <Column field="pName" header="Adı" style={{ minWidth: '12rem', fontWeight: 'bold'}} />
                        <Column field="pSurname" header="Soyadı" style={{ minWidth: '14rem', fontWeight: 'bold'}}/>
                        <Column field="pPlayerAge" header="Yaşı" style={{ minWidth: '7rem' }}/>
                        <Column field="pValue" header="Piyasa Değeri" body={(rowData: Demo.Futbolcu) => formatPValue(rowData.pValue)} style={{ minWidth: '10rem' }}/>
                        <Column field="pCountry" header="Uyruk" style={{ minWidth: '12rem' }} />
                        <Column field="pPosition" header="Mevkisi" style={{ minWidth: '12rem' }} />
                        <Column field="oyuncuHangiTakimda" header="Takımı" style={{ minWidth: '8rem' }}/>
                        <Column body={(rowData: Demo.Futbolcu) => (<Button icon="pi pi-trash" onClick={() => oyuncuyuSil(rowData.id)} className="p-button-danger"/>)} style={{ minWidth: '5rem' }}/>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default PlayersGet;
