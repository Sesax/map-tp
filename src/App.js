import React, { useMemo } from 'react';
import Map from './components/Map';
import { useEffect, useState, } from 'react';
import { useParams } from 'react-router-dom';
import { throttle } from 'lodash';
import { Button, Center, Heading, Input, Menu, MenuItem, Stack } from '@chakra-ui/react';

const location = {
  lat: 50.6292,
  lng: 3.0573,
}

const App = () => {
  const { id } = useParams();
  const [cities, setCities] = useState(null);
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultPerPage] = useState(100);


  useEffect(() => {
    const fetchCities = async () => {
      const response = await fetch('https://geo.api.gouv.fr/communes?fields=code,nom,departement,centre,region,codesPostaux')
      const data = await response.json();

      if (response.ok) {
        setCities(data);
      }
    }

    fetchCities();
  }, [id]);

  const throttleSearch = throttle((value) => {
    setSearch(value);
    setShowResults(value.length > 0);
  }, 500);

  // fonction de recherche
  const handleSearch = (e) => {
    throttleSearch(e.target.value);
  }

  // fonction de filtrage
  const filteredCities = useMemo(() => {
    return cities?.filter((city) => city.nom.toLowerCase().includes(search.toLowerCase())) || [];
  }, [cities, search]);

  // fonction de pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // fonction de pagination
  const indexOfLastResult = currentPage * resultPerPage;
  const indexOfFirstResult = indexOfLastResult - resultPerPage;
  const currentResults = filteredCities.slice(indexOfFirstResult, indexOfLastResult);

  // fonction de pagination
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredCities.length / resultPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <Center>
        <Stack pt={6} pb={6} spacing={4} direction='column' align='center'>
          <Heading pt={6}>Tp React Navigation / AutoComplétion</Heading>
        </Stack>
      </Center>
      <Center>
        <Stack pt={6}>
          <Input onChange={handleSearch} value={search} placeholder='Recherche une ville, departement, regions' />
          {showResults && filteredCities.length > 0 && (
            <Menu>
              {currentResults.map((result) => (
                <MenuItem key={result.code} p={2} shadow='md' borderWidth='1px' onClick={() => setSearch(result.nom)}>
                  {result.nom}
                </MenuItem>
              ))}
              <div>
                {pageNumbers.map((number) => (
                  <Button key={number} onClick={() => paginate(number)}>
                    {number}
                  </Button>
                ))}
              </div>
            </Menu>
          )}
        </Stack>
      </Center>
      <Map location={location} zoomLevel={11} />
    </div>
  );
};

export default App;