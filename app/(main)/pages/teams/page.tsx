'use client';
import axios from 'axios';
import React, { use, useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as api from '../../../api/SpringAxios';
import { Dialog } from 'primereact/dialog';
import type { Demo } from '@/types';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';


const TeamsGet = () => {
  const [teams, setTeams] = useState<Demo.Takim[]>([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [dialogHeader, setDialogHeader] = useState('Header');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await api.getTakimlar();
        setTeams(teamsData);
      } catch (error) {
        console.log("Hata: ",error);
      }
    };

    fetchTeams();
  }, []);

  const handleTeamSelection = async (selectedTeamId:any) => {
    try {
      // Seçilen takımın futbolcularını getir
      const playersData = await api.getPlayersInTeams(selectedTeamId);
      setPlayers(playersData);
      setVisible(true);
      setSelectedTeam(selectedTeamId);
      const teamName = teams?.find((team:Demo.Takim) => team.id === selectedTeamId)?.tName; // Takım ismini bul
      setDialogHeader(`${teamName} kadrosu`)
    } catch (error) {
      // Hata yönetimi burada
    }
  };

  const takimLogoBase64 = (base64Data: string) => {
    return <div style={{
    borderRadius: '50%',
    overflow: 'hidden',
    width: '40px',
    height: '40px'}}>
      <img src={`data:image/png;base64,${base64Data}`} alt="Oyuncu Fotoğrafı" style={{ width: '100%', height: '100%' }} />
    </div>;
  };

  const oyuncuLogoBase64 = (base64Data: string) => {
    return <div style={{
    overflow: 'hidden',
    width: '50px',
    height: '50px'}}>
      <img src={`data:image/png;base64,${base64Data}`} alt="Oyuncu Fotoğrafı" style={{ width: '100%', height: '100%' }} />
    </div>;
  };

  const formatTValue = (value: string) => {
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

const yasTemplate = (rowData: Demo.Futbolcu) => {
  const oyuncuYas = classNames('border-circle w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm', {
      'bg-blue-100 text-blue-900': rowData.yas == 0,
      'bg-teal-200 text-teal-900': rowData.yas > 0 && rowData.yas <= 32,
      'bg-red-100 text-red-900': rowData.yas >= 33
  });

  return <div className={oyuncuYas}>{rowData.yas}</div>;
};
//   const [teams, setTeams] = useState([]);
  
  
//   useEffect(() => {
//     const verileriGetir = async () => {
//       const options = {
//         method: 'GET',
//         url: 'https://premier-league-standings1.p.rapidapi.com/',
//         headers: {
//           'X-RapidAPI-Key': '156fd61e29mshaa93cb83e034120p15c61bjsnc9047a4ba381',
//           'X-RapidAPI-Host': 'premier-league-standings1.p.rapidapi.com'
//         }
//       };
    
//     try {
//       const response = await axios.request(options);
//       const formattedTeams = response.data.map(item => ({
//         team: item.team,  // team içindeki veriler
//         stats: item.stats  // stats içindeki veriler
//       }));

//       setTeams(formattedTeams);
//       console.log(formattedTeams);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   verileriGetir();
// }, []);

// const logoTemplate = (rowData: { team: { logo: string | undefined; }; }) => {
//   return <img src={rowData.team.logo} alt="Logo" style={{ width: '30px' }} />;
// };

    return (
      <div className="card">
      {/* <DataTable value={teams} tableStyle={{ minWidth: '50rem' }}>
          <Column field="stats.rank" header="Sıra" style={{width: '1rem'}}></Column>
          <Column field="team.logo" body={logoTemplate} header="Logo"></Column>
          <Column field="team.name" header="Takım Adı"></Column>
          <Column field="stats.gamesPlayed" header="Oynadığı Maç"></Column>
          <Column field="stats.wins" header="Galibiyet"></Column>
          <Column field="stats.ties" header="Beraberlik"></Column>
          <Column field="stats.losses" header="Mağlubiyet"></Column>
          <Column field="stats.goalsFor" header="Attığı Gol"></Column>
          <Column field="stats.goalsAgainst" header="Yediği Gol"></Column>
          <Column field="stats.goalDifference" header="Averaj"></Column>
          <Column field="stats.points" header="Puan"></Column>
      </DataTable> */}
      <DataTable value={teams} emptyMessage="Takım bulunamadı." tableStyle={{ minWidth: '50rem' }}>
        {/* <Column field="id" header="ID" style={{ width: '5rem' }}></Column> */}
        <Column field="filePath" header="Logo" style={{ width: '8rem' }} body={(rowData: Demo.Takim) => takimLogoBase64(rowData.filePath)} />
        <Column field="tName" style={{ fontWeight: 'bold', color:'#4C5D8B' }} header="Takım Adı"></Column>
        <Column field="tPoint" header="Takım Puanı"/>
        <Column field="tValue" header="Takımın Piyasa Değeri" body={(rowData: Demo.Takim)=> formatTValue(rowData.tValue.toString())}/>
        <Column field="takimHangiUlkede" header="Takımın Ülkesi"/>
        <Column header="Takım Kadrosu" body={(rowData) => (<Button label="Takım Kadrosu" onClick={() => handleTeamSelection(rowData.id)} severity='danger'/>)} />
      </DataTable>
      <Dialog header={dialogHeader} visible={visible} style={{ width: '70vw' }} onHide={() => setVisible(false)}>

      {selectedTeam && (
        <DataTable value={players} resizableColumns showGridlines columnResizeMode="expand" emptyMessage="Kadroya Oyuncu Eklenmemiş." tableStyle={{ minWidth: '60rem' }}>
          <Column field="resim" header="#" body={(rowData:Demo.Takim) => oyuncuLogoBase64(rowData.resim)} />
          <Column field="adi" header="Adı"></Column>
          <Column field="soyadi" header="Soyadı"></Column>
          <Column field="ulke" header="Uyruk"></Column>
          <Column field="kilo" header="Kilo"></Column>
          <Column field="boy" header="Boy"></Column>
          <Column field="mevki" header="Mevkisi"></Column>
          <Column field="yas" body={yasTemplate} header="Yaş"></Column>
          <Column field="deger" body={(rowData: Demo.Takim)=> formatTValue(rowData.deger.toString())} header="Piyasa Değeri"></Column>
          <Column field="ayak" header="Oynadığı Ayak"></Column>
        </DataTable>
      )}
      </Dialog>
  </div>
    );
};

export default TeamsGet;
