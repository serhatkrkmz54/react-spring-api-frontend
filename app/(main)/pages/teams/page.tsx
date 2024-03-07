'use client';
import axios from 'axios';
import React, { use, useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const TeamsGet = () => {

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const verileriGetir = async () => {
      const options = {
        method: 'GET',
        url: 'https://premier-league-standings1.p.rapidapi.com/',
        headers: {
          'X-RapidAPI-Key': '156fd61e29mshaa93cb83e034120p15c61bjsnc9047a4ba381',
          'X-RapidAPI-Host': 'premier-league-standings1.p.rapidapi.com'
        }
      };
    
    try {
      const response = await axios.request(options);
      const formattedTeams = response.data.map(item => ({
        team: item.team,  // team içindeki veriler
        stats: item.stats  // stats içindeki veriler
      }));

      setTeams(formattedTeams);
      console.log(formattedTeams);
    } catch (error) {
      console.error(error);
    }
  };
  verileriGetir();
}, []);

const logoTemplate = (rowData: { team: { logo: string | undefined; }; }) => {
  return <img src={rowData.team.logo} alt="Logo" style={{ width: '30px' }} />;
};

    return (
      <div className="card">
      <DataTable value={teams} tableStyle={{ minWidth: '50rem' }}>
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
      </DataTable>
  </div>
    );
};

export default TeamsGet;
