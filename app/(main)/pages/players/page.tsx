'use client';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { use, useEffect, useState, useRef, Suspense } from 'react';
import type { Demo } from '@/types';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { ListBox } from 'primereact/listbox';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import * as api from '../../../api/SpringAxios';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Accordion, AccordionTab } from 'primereact/accordion';


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
    const [selectedFutbolcu, setSelectedFutbolcu] = useState(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [oyuncuDuzenleDialog, setOyuncuDuzenleDialog] = useState(false);

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
        initFilters1();
        loadFutbolcular();
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
        width: '60px',
        height: '60px'}}>
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
           const [formaNo, setFormaNo] = useState<number | undefined | null>();
           const [kilo, setKilo] = useState<number | undefined | null>();
           const [boy, setBoy] = useState<number | undefined | null>();
           const [mevki, setMevki] = useState<Demo.Mevki | null>(null);
           const [yas, setYas] = useState<number | undefined | null>();
           const [deger, setDeger] = useState<number | undefined | null>();
           const [ayak, setAyak] = useState<Demo.Ayak | null>(null);
           const [selectedTeam, setSelectedTeam] = useState<Demo.Takim | null>(null);
           const [selectedCountry, setSelectedCountry] = useState<Demo.Ulkeler | null>(null);
           const fileUploadRef = useRef<HTMLInputElement | null>(null);
           const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
           const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
           const [hasError, setHasError] = useState(false);

           const teamsLogoTemplate = (option: Demo.Takim) => {
            const imageSrc = `data:image/png;base64,${option.filePath}`;
            return (
                <div className="flex align-items-center">
                    <img alt={option.tName} src={imageSrc} style={{ width: '1.25rem', marginRight: '.5rem' }}/>
                    <div>{option.tName}</div>
                </div>
            );
        };


           const ayakSecenekler: Demo.Ayak[] = [
            { name : 'Sağ Ayak', code: 'SAA'},
            { name : 'Sol Ayak', code: 'SOA'},  
            { name : 'Çift Ayak', code: 'ÇA'}
           ];

           const mevkiler: Demo.Mevki[] = [
            { name: 'Kaleci', code: 'GK'},
            { name: 'Defans', code: 'DF'},
            { name: 'Orta Saha', code: 'OS'},
            { name: 'Sağ Kanat', code: 'SĞK'},
            { name: 'Sol Kanat', code: 'SLK'},
            { name: 'Forvet', code: 'F'}  
           ];

           const handleSubmit = async (e:React.FormEvent) => {
            e.preventDefault();
          
            try {
              const formData = new FormData();
              formData.append('pName', adi);
              formData.append('pSurname', soyadi);
              formData.append('formaNo', formaNo?.toString() || '');
              formData.append('pCountry', uyruk);
              formData.append('pWeight', kilo?.toString() || '');
              formData.append('pHeight', boy?.toString() || '');
              formData.append('pPosition', mevki?.toString() || '');
              formData.append('pPlayerAge', yas?.toString() || '');
              formData.append('pValue', deger?.toString() || '');
              formData.append('pFoot', ayak?.toString() || '');
              formData.append('toTeams', selectedTeam?.toString() || '');
              formData.append('toCountryPlayers', selectedCountry?.toString() || '');
              const fileInput = fileUploadRef.current?.files?.[0];
              if (fileInput) {
                formData.append('pathFile', fileInput, fileInput.name);
              }
              await api.postFutbolcu(formData);
              const fetchedData = await api.getFutbolcular();
              setFutbolcular(fetchedData);
              setVisible(false);
              setAdi('');
              setSoyadi('');
              setUyruk('');
              setFormaNo(null);
              setKilo(null);
              setBoy(null);
              setMevki(null);
              setYas(null);
              setDeger(null);
              setAyak(null);
              setSelectedTeam(null);
              setSelectedCountry(null);
              setPreviewImage(undefined);
              showToast('success', 'Başarı', 'Futbolcu başarıyla eklendi!', 5000);
            } catch (error) {
              showToast('error', 'Hata', 'Futbolcu eklenirken bir hata oluştu.', 5000);
              console.error('Hata oluştu:', error);
            }
          };

           const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            const fileName = e.target.value.split(/(\\|\/)/).pop(); 
            let truncatedFileName = fileName;
            if (fileName.length > 40) {
                truncatedFileName = fileName?.substring(0, 37) + '...'; 
            }
            const parentWrapper = e.target.closest('.file-upload-wrapper');
            if (parentWrapper) {
                parentWrapper.dataset.text = truncatedFileName;
            }
            
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
                  showToast('error', 'Hata', 'Seçtiğiniz fotoğrafta yüz algılanmadı, başka bir fotoğraf yüklemeyi deneyin', 5000);
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
              
            const showDetailsDialog = (rowData:any) => {
              setSelectedFutbolcu(rowData);
              setDisplayDialog(true);
            };
          
            const hideDetailsDialog = () => {
              setSelectedFutbolcu(null);
              setDisplayDialog(false);
            };

            const futbolcuDetayHeader = () => (
              <div className="inline-flex align-items-center justify-content-center gap-2">
                <img src={`data:image/jpeg;base64,${selectedFutbolcu?.filePath}`} alt="Fotoğraf" width="40" height="40" />
                  <span className="font-bold white-space-nowrap"> {selectedFutbolcu?.pName} {selectedFutbolcu?.pSurname}</span>
              </div>
          );
            const renderDetailsDialog = () => {
              if (!selectedFutbolcu) {
                return null;
              }
          
              return (
                <Dialog
                  visible={displayDialog}
                  onHide={hideDetailsDialog}
                  header={futbolcuDetayHeader}
                  modal
                  style={{ width: '50vw' }}
                >
                  {/* Futbolcu detaylarını buraya ekleyin */}
                  <p>ID: {selectedFutbolcu.id}</p>
                  <p>Adı: {selectedFutbolcu.pName}</p>
                  <p>Soyadı: {selectedFutbolcu.pSurname}</p>
                  <p>Forma Numarası: {selectedFutbolcu.formaNo || "Yok"}</p>
                  <p>Uyruk: {selectedFutbolcu.pCountry}</p>
                  <p>Kilosu: {selectedFutbolcu.pWeight}</p>
                  <p>Boyu: {selectedFutbolcu.pHeight}</p>
                  <p>Mevkisi: {selectedFutbolcu.pPosition}</p>
                  <p>Yaşı: {selectedFutbolcu.pPlayerAge}</p>
                  <p>Piyasa Değeri: €{selectedFutbolcu.pValue}</p>
                  <p>Oynadığı Ayak: {selectedFutbolcu.pFoot}</p>
                  <p>Oynadığı Takım: {selectedFutbolcu.oyuncuHangiTakimda || "Oyuncu Boşta"}</p>
                  <p>Milli Takımı: {selectedFutbolcu?.oyuncuHangiUlkede || "Değer Girilmemiş"}</p>
                  <Accordion activeIndex={0}>
                      <AccordionTab header="Transfer Geçmişi">
                        <DataTable emptyMessage="Transfer geçmişi bulunamıyor." value={selectedFutbolcu.transferGecmisi} className="p-datatable-striped">
                          <Column field="fromTeam" header="Eski Takım" />
                          <Column field="toTeam" header="Yeni Takım" />
                          <Column field="transferFee"  body={(rowData: Demo.Futbolcu) => formatPValue(rowData.transferFee.toString())}  header="Transfer Ücreti" />
                          <Column field="transferDate" header="Transfer Tarihi" />
                          <Column field="transferType" header="Transfer Türü" />
                          </DataTable>
                    </AccordionTab>
                  </Accordion>        
                  {/* Diğer detayları ekleyin */}
                </Dialog>
              );
            };
          
            // Sayfa yüklenmesini yapan kod parçası

            useEffect(() => {
              const timeout = setTimeout(() => {
                  setLoading(false);
              }, 700);
      
              return () => clearTimeout(timeout);
          }, []);
      
          if (loading) {
              return <div className="flex justify-content-center">
            <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
          </div>;
          }

            // Sayfa yüklenmesini yapan kod parçası

            // Oyuncu düzenleme kısmı komple burası

            const oyuncuDuzenleDialogAc = (rowData:any) => {
              setSelectedFutbolcu(rowData);
              setOyuncuDuzenleDialog(true);
            };

            const oyuncuDuzenleDialogKapat = () => {
              setSelectedFutbolcu(null);
              setOyuncuDuzenleDialog(false);
            };

            const oyuncuDuzenleDialogHeader = () => (
              <div className="inline-flex align-items-center justify-content-center gap-2">
                <img src={`data:image/jpeg;base64,${selectedFutbolcu?.filePath}`} alt="Fotoğraf" width="50" height="50" style={{ borderRadius: "50%" }} />
                  <span className="font-bold white-space-nowrap ml-2"> {selectedFutbolcu?.pName} {selectedFutbolcu?.pSurname}</span>
              </div>
          );

          const renderOyuncuDuzenleDialog = () => {
            if (!selectedFutbolcu) {
              return null;
            }
        
            return (
              <Dialog
                visible={oyuncuDuzenleDialog}
                onHide={oyuncuDuzenleDialogKapat}
                header={oyuncuDuzenleDialogHeader}
                style={{ width: '60rem' }} 
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                modal 
                className="p-fluid"
              >
                <form onSubmit={oyuncuDuzenleSubmit} encType="multipart/form-data">
                  <div className="field">
                    <label htmlFor="pName" className="font-bold">
                      Adı
                    </label>
                    <InputText id="pName" placeholder="Adını giriniz" value={selectedFutbolcu.pName} onChange={(e) => setSelectedFutbolcu({...selectedFutbolcu, pName: e.target.value})} tooltip="Futbolcunun tam adını giriniz" tooltipOptions={{ position: 'bottom' }} aria-describedby="username-help" />
                  </div>
                  <div className="field">
                    <label htmlFor="pSurname" className="font-bold">
                      Soyadı
                    </label>
                    <InputText id="pSurname" placeholder="Soyadını giriniz" value={selectedFutbolcu.pSurname} onChange={(e) => setSelectedFutbolcu({...selectedFutbolcu, pSurname: e.target.value})} tooltip="Futbolcunun tam soyadını giriniz" tooltipOptions={{ position: 'bottom' }} aria-describedby="username-help" />
                  </div>
                  <div className="field">
                    <label htmlFor="formaNo" className="font-bold">
                      Forma Numarası
                    </label>
                    <InputNumber inputId="withoutgrouping" value={selectedFutbolcu.formaNo} onValueChange={(e: InputNumberValueChangeEvent) => setSelectedFutbolcu({...selectedFutbolcu, formaNo: e.value})} useGrouping={false} tooltip="Futbolcunun güncel forma numarasını giriniz" tooltipOptions={{ position: 'bottom' }} placeholder="Forma numarasını giriniz"/>
                  </div>
                  <div className="field">
                    <label htmlFor="pCountry" className="font-bold">
                      Uyruk
                    </label>
                    <InputText id="pCountry" placeholder="Uyruk giriniz" value={selectedFutbolcu.pCountry} onChange={(e) => setSelectedFutbolcu({...selectedFutbolcu, pCountry: e.target.value})} tooltip="Futbolcunun doğduğu ülkeyi giriniz" tooltipOptions={{ position: 'bottom' }} aria-describedby="username-help" />
                  </div>
                  <div className="field">
                    <label htmlFor="pWeight" className="font-bold">
                      Kilosu
                    </label>
                    <InputNumber inputId="withoutgrouping" value={selectedFutbolcu.pWeight} onValueChange={(e: InputNumberValueChangeEvent) => setSelectedFutbolcu({...selectedFutbolcu, pWeight: e.value})} useGrouping={false} tooltip="Futbolcunun kilosunu giriniz" tooltipOptions={{ position: 'bottom' }} placeholder="Kilosunu giriniz"/>
                  </div>
                  <div className="field">
                    <label htmlFor="pHeight" className="font-bold">
                      Boyu
                    </label>
                    <InputNumber inputId="withoutgrouping" value={selectedFutbolcu.pHeight} showButtons min={0} max={300} onValueChange={(e: InputNumberValueChangeEvent) => setSelectedFutbolcu({...selectedFutbolcu, pHeight: e.value})} tooltip="Futbolcunun boyunu tamsayı şeklinde giriniz (Örnek: 185 boyunda)" tooltipOptions={{ position: 'bottom' }} placeholder="Boyunu girin" useGrouping={false} />
                  </div>
                  <div className="field">
                    <label htmlFor="pPosition" className="font-bold">
                      Mevkisi
                    </label>
                    <Dropdown value={selectedFutbolcu.pPosition} onChange={(e: DropdownChangeEvent) => setSelectedFutbolcu({...selectedFutbolcu, pPosition: e.value})} options={mevkiler} optionLabel="name" optionValue='name' placeholder="Oynadığı Mevki" />
                  </div>
                  <div className="field">
                    <label htmlFor="pPlayerAge" className="font-bold">
                      Yaşı
                    </label>
                    <InputNumber inputId="withoutgrouping" tooltip="Futbolcunun yaşını giriniz" tooltipOptions={{ position: 'bottom' }} placeholder="Yaşını girin" value={selectedFutbolcu.pPlayerAge} onValueChange={(e: InputNumberValueChangeEvent) => setSelectedFutbolcu({...selectedFutbolcu, pPlayerAge: e.value})} useGrouping={false} />
                  </div>
                  <div className="field">
                    <label htmlFor="pValue" className="font-bold">
                      Piyasa Değeri
                    </label>
                    <InputNumber value={selectedFutbolcu.pValue} onValueChange={(e) => setSelectedFutbolcu({...selectedFutbolcu, pValue: e.value})} tooltip="Futbolcunun piyasa değerini örnekteki gibi giriniz" tooltipOptions={{ position: 'bottom' }} placeholder="Örnek: €50,000 <== Bin, €1,000,000 <= Milyon"/>
                  </div>
                  <div className="field">
                    <label htmlFor="pFoot" className="font-bold">
                      Oynadığı Ayak
                    </label>
                    <Dropdown value={selectedFutbolcu.pFoot} onChange={(e: DropdownChangeEvent) => setSelectedFutbolcu({...selectedFutbolcu, pFoot: e.value})} options={ayakSecenekler} optionLabel="name" optionValue='name' placeholder="Oynadığı Ayak" />
                  </div>
                  <div className="field">
                    <label htmlFor="oyuncuHangiTakimda" className="font-bold">
                      Oynadığı Takım
                    </label>
                    <ListBox
                      value={selectedFutbolcu.toTeams}
                      options={takimlar}
                      onChange={(e) => setSelectedFutbolcu({...selectedFutbolcu, toTeams: e.value})}
                      optionValue="id"
                      optionLabel="tName" 
                      filter
                      placeholder="Oynadığı Takım"
                      itemTemplate={teamsLogoTemplate}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="oyuncuHangiUlkede" className="font-bold">
                      Milli Takımı
                    </label>
                    <Dropdown
                      value={selectedFutbolcu.toCountryPlayers}
                      onChange={(e) => setSelectedFutbolcu({...selectedFutbolcu, toCountryPlayers: e.value})}
                      options={ulkeler}
                      optionValue="id"
                      optionLabel="cName"
                      showClear 
                      placeholder="Milli Takım Seçiniz" 
                      className="w-full md:w-35rem" />
                  </div>
                  <div className="field hidden">
                  <InputText value={selectedFutbolcu.filePath} onChange={(e) => setSelectedFutbolcu({...selectedFutbolcu, filePath: e.target.value})} />
                  </div>
                  <div className="field">
                  <label htmlFor="pName" className="font-bold">
                        Fotoğraf
                    </label>
                <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '10px ', marginTop:'10px' }}>
                    <div className="file-upload-wrapper" data-text="Fotoğraf Yükleyin!">
                      <input ref={fileUploadRef} type="file" onChange={handleFileChange} className="file-upload-field" />
                    </div>
                    {selectedFile && (
                        <div>
                        {previewImage && (<img src={previewImage} alt="Dosya Önizleme" style={{ maxWidth: '100px', maxHeight: '70px',  marginRight: '50px' }} /> )}
                        </div>
                    )}
                 </div>
                  </div>
                  <div className="field">
                    <Button type="submit" onClick={oyuncuDuzenleSubmit} label="Güncelle"/>
                  </div>
                </form>
              </Dialog>
            );
          };
          const oyuncuDuzenleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          const oyuncuID = selectedFutbolcu?.id;
          
          try {
            const formData = new FormData();
            formData.append('pName', selectedFutbolcu?.pName as string);
            formData.append('pSurname', selectedFutbolcu?.pSurname as string);
            formData.append('formaNo', selectedFutbolcu?.formaNo?.toString() || '');
            formData.append('pCountry', selectedFutbolcu?.pCountry as string);
            formData.append('pWeight', selectedFutbolcu?.pWeight?.toString() || '');
            formData.append('pHeight', selectedFutbolcu?.pHeight?.toString() || '');
            formData.append('pPosition', selectedFutbolcu?.pPosition as string);
            formData.append('pPlayerAge', selectedFutbolcu?.pPlayerAge?.toString() || '');
            formData.append('pValue', selectedFutbolcu?.pValue?.toString() || '');
            formData.append('pFoot', selectedFutbolcu?.pFoot as string);
            formData.append('toTeams', selectedFutbolcu?.toTeams || '');
            formData.append('toCountryPlayers', selectedFutbolcu?.toCountryPlayers || '');
            formData.append('filePath', selectedFutbolcu?.filePath || '');
            const fileInput = fileUploadRef.current?.files?.[0];
            if (fileInput && selectedFutbolcu?.filePath) {
                formData.set('pathFile', fileInput, fileInput.name);
            }
            await api.oyuncuGuncelle(oyuncuID as number, formData);
            oyuncuDuzenleDialogKapat();
            showToast('success', 'Başarı', 'Futbolcu başarıyla güncellendi!', 5000);
          
          } catch (error) {
            showToast('error', 'Hata', 'Futbolcu güncellenirken bir hata oluştu.', 5000);
            console.error('Hata oluştu:', error);
          } 
          };

            // Oyuncu düzenleme kısmı komple burası


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
                    <AvatarGroup>
                        <Avatar image="https://img.a.transfermarkt.technology/portrait/big/28396-1696447661.png?lm=1" size="large" shape="circle" />
                        <Avatar image="https://img.a.transfermarkt.technology/portrait/big/28003-1694590254.jpg?lm=1" size="large" shape="circle" />
                        <Avatar image="https://img.a.transfermarkt.technology/portrait/big/8198-1694609670.jpg?lm=1" size="large" shape="circle" />
                        <Avatar image="https://img.a.transfermarkt.technology/portrait/big/191614-1698609730.png?lm=1" size="large" shape="circle" />
                        <Avatar label="+" shape="circle" size="large"/>
                    </AvatarGroup>
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
                    {/* <span className="text-green-500 font-medium">%52+ </span>
                    <span className="text-500">geçen haftadan bu yana</span> */}
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
            
            <Dialog header="Futbolcu Ekle" visible={visible} style={{ width: '60rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal className="p-fluid" onHide={() => setVisible(false)}>
            <form onSubmit={handleSubmit}>
                    <label htmlFor="pName" className="font-bold">
                        Fotoğraf
                    </label>
                <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '10px ', marginTop:'10px' }}>
                    <div className="file-upload-wrapper" data-text="Fotoğraf Yükleyin!">
                      <input ref={fileUploadRef} type="file" onChange={handleFileChange} className="file-upload-field" />
                    </div>
                    {selectedFile && (
                        <div>
                        {previewImage && (<img src={previewImage} alt="Dosya Önizleme" style={{ maxWidth: '100px', maxHeight: '70px',  marginRight: '50px' }} /> )}
                        </div>
                    )}
                 </div>
                 <div className="field">
                    <label htmlFor="pName" className="font-bold">
                        Adı
                    </label>
                    <InputText id="pName" placeholder="Adını giriniz" value={adi} onChange={(e) => setAdi(e.target.value)} tooltip="Futbolcunun tam adını giriniz" tooltipOptions={{ position: 'bottom' }} aria-describedby="username-help" />
                    
                </div>
                <div className="field">
                    <label htmlFor="pSurname" className="font-bold">
                        Soyadı
                    </label>
                    <InputText id="pSurname" placeholder="Soyadını giriniz" value={soyadi} onChange={(e) => setSoyadi(e.target.value)} tooltip="Futbolcunun tam soyadını giriniz" tooltipOptions={{ position: 'bottom' }} aria-describedby="username-help" />
                </div>
                <div className="field">
                    <label htmlFor="formaNo" className="font-bold">
                        Forma Numarası
                    </label>
                    <InputNumber inputId="withoutgrouping" value={formaNo} onValueChange={(e: InputNumberValueChangeEvent) => setFormaNo(e.value)} useGrouping={false} tooltip="Futbolcunun güncel forma numarasını giriniz" tooltipOptions={{ position: 'bottom' }} placeholder="Forma numarasını giriniz"/>
                </div>
                <div className="field">
                    <label htmlFor="pCountry" className="font-bold">
                        Uyruk
                    </label>
                    <InputText id="pCountry" placeholder="Uyruk giriniz" value={uyruk} onChange={(e) => setUyruk(e.target.value)} tooltip="Futbolcunun doğduğu ülkeyi giriniz" tooltipOptions={{ position: 'bottom' }} aria-describedby="username-help" />
                </div>
                <div className="field">
                    <label htmlFor="pWeight" className="font-bold">
                        Kilosu
                    </label>
                    <InputNumber inputId="withoutgrouping" value={kilo} onValueChange={(e: InputNumberValueChangeEvent) => setKilo(e.value)} useGrouping={false} tooltip="Futbolcunun kilosunu giriniz" tooltipOptions={{ position: 'bottom' }} placeholder="Kilosunu giriniz"/>
                </div>
                <div className="field">
                    <label htmlFor="pHeight" className="font-bold">
                        Boyu
                    </label>
                    <InputNumber inputId="withoutgrouping" value={boy} showButtons min={0} max={300} onValueChange={(e: InputNumberValueChangeEvent) => setBoy(e.value)} tooltip="Futbolcunun boyunu tamsayı şeklinde giriniz (Örnek: 185 boyunda)" tooltipOptions={{ position: 'bottom' }} placeholder="Boyunu girin" useGrouping={false} />
                </div>
                <div className="field">
                    <label htmlFor="pPosition" className="font-bold">
                        Mevkisi
                    </label>
                    <Dropdown value={mevki} onChange={(e: DropdownChangeEvent) => setMevki(e.value)} options={mevkiler} optionLabel="name" optionValue='name' placeholder="Oynadığı Mevki" />
                </div>
                <div className="field">
                    <label htmlFor="pPlayerAge" className="font-bold">
                        Yaşı
                    </label>
                    <InputNumber inputId="withoutgrouping" tooltip="Futbolcunun yaşını giriniz" tooltipOptions={{ position: 'bottom' }} placeholder="Yaşını girin" value={yas} onValueChange={(e: InputNumberValueChangeEvent) => setYas(e.value)} useGrouping={false} />
                </div>
                <div className="field">
                    <label htmlFor="pValue" className="font-bold">
                        Piyasa Değeri
                    </label>
                    <InputNumber value={deger} onValueChange={(e) => setDeger(e.value)} tooltip="Futbolcunun piyasa değerini örnekteki gibi giriniz" tooltipOptions={{ position: 'bottom' }} placeholder="Örnek: €50,000 <== Bin, €1,000,000 <= Milyon"/>
                </div>
                <div className="field">
                    <label htmlFor="pFoot" className="font-bold">
                        Oynadığı Ayak
                    </label>
                    <Dropdown value={ayak} onChange={(e: DropdownChangeEvent) => setAyak(e.value)} options={ayakSecenekler} optionLabel="name" optionValue='name' placeholder="Oynadığı Ayak" />
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
                    itemTemplate={teamsLogoTemplate}
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
                        header={header1}>  

                        {/* <Column field="id" header="ID" style={{ minWidth: '8rem', fontWeight: 'bold'}} /> */}
                        <Column field="filePath" body={(rowData: Demo.Futbolcu) => renderImage(rowData.filePath)} header="Fotoğraf" style={{ minWidth: '5rem' }} />
                        <Column field="pName" header="Adı" style={{ minWidth: '12rem', fontWeight: 'bold'}} />
                        <Column field="pSurname" header="Soyadı" style={{ minWidth: '14rem', fontWeight: 'bold'}}/>
                        <Column field="pPlayerAge" header="Yaşı" style={{ minWidth: '7rem' }}/>
                        <Column field="pValue" header="Piyasa Değeri" body={(rowData: Demo.Futbolcu) => formatPValue(rowData.pValue.toString())} style={{ minWidth: '10rem' }}/>
                        <Column field="pCountry" header="Uyruk" style={{ minWidth: '12rem' }} />
                        <Column field="pPosition" header="Mevkisi" style={{ minWidth: '12rem' }} />
                        <Column field="oyuncuHangiTakimda" header="Takımı" style={{ minWidth: '8rem' }}/>
                        <Column body={(rowData: Demo.Futbolcu) => (<Button icon="pi pi-trash" onClick={() => oyuncuyuSil(rowData.id)} className="p-button-danger"/>)} style={{ minWidth: '5rem' }}/>
                        <Column body={(rowData) => (<Button icon="pi pi-search" onClick={() => showDetailsDialog(rowData)} /> )} />
                        <Column body={(rowData) => (<Button icon="pi pi-pencil" onClick={() => oyuncuDuzenleDialogAc(rowData)} /> )} />

                    </DataTable>
                    {renderDetailsDialog()}
                    {renderOyuncuDuzenleDialog()}
                </div>
            </div>
            
        </div>
        
    );
};

export default PlayersGet;