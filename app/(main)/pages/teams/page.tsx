'use client';
import axios from 'axios';
import React, { use, useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as api from '../../../api/SpringAxios';
import { Dialog } from 'primereact/dialog';
import type { Demo } from '@/types';


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
      <DataTable value={teams} tableStyle={{ minWidth: '50rem' }}>
        <Column field="id" header="ID"></Column>
        <Column field="tName" header="Team Name"></Column>
        <Column
          body={(rowData) => (
            <button onClick={() => handleTeamSelection(rowData.id)}>Show Players</button>
          )}
        ></Column>
      </DataTable>
      <Dialog header={dialogHeader} visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>

      {selectedTeam && (
        <DataTable value={players} tableStyle={{ minWidth: '50rem' }}>
          <Column field="adi" header="Name"></Column>
          <Column field="soyadi" header="Surname"></Column>
          <Column field="ulke" header="Country"></Column>
          <Column field="kilo" header="Weight"></Column>
          <Column field="boy" header="Height"></Column>
          <Column field="mevki" header="Position"></Column>
          <Column field="yas" header="Age"></Column>
          <Column field="deger" header="Value"></Column>
          <Column field="ayak" header="Foot"></Column>
        </DataTable>
      )}
      </Dialog>
  </div>
    );
};

export default TeamsGet;
