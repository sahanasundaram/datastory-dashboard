'use client';

import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Box,
  Select,
  Spinner,
  Text,
  VStack,
  Heading,
  Flex,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const COUNTRIES_QUERY = gql`
  query Countries {
    item(where: {class_id: {_eq: "Country"}}) {
      id
      name: name(path: "en")
      iso2: statements(where: {property_id: {_eq: "iso2"}}) {
        value: postgres_varchar
      }
    }
  }
`;

const CUBE_QUERY = gql`
  query CubeData($country: String!, $measure: String!) {
    cube_cube_M6Lh5is0FtqUhZ(where: {country: {_eq: $country}, measure: {_eq: $measure}}) {
      value
      year
    }
  }
`;

const measures = [
  { key: 'life_expectancy', label: 'Life Expectancy' },
  { key: 'population', label: 'Population' },
  { key: 'net_migration_rate', label: 'Net Migration Rate' },
];

export default function Page() {
  const { data: countriesData, loading: countriesLoading, error: countriesError } = useQuery(COUNTRIES_QUERY);

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedMeasure, setSelectedMeasure] = useState(measures[0].key);

  // Color modes for cards and backgrounds
  const cardBg = useColorModeValue('white', 'gray.700');
  const selectBg = useColorModeValue('gray.100', 'gray.600');

  useEffect(() => {
    if (countriesData && countriesData.item.length > 0 && !selectedCountry) {
      const firstCountry = countriesData.item[0].name.toLowerCase().split(' ')[0];
      setSelectedCountry(firstCountry);
    }
  }, [countriesData, selectedCountry]);

  const { data: cubeData, loading: cubeLoading, error: cubeError } = useQuery(CUBE_QUERY, {
    variables: { country: selectedCountry || '', measure: selectedMeasure },
    skip: !selectedCountry,
  });

  return (
    <Box p={{ base: 4, md: 10 }} maxW="7xl" mx="auto">
      <Heading mb={6} textAlign="center" fontWeight="extrabold" fontSize={{ base: '3xl', md: '4xl' }}>
        Datastory Dashboard
      </Heading>

      <Flex direction={{ base: 'column', md: 'row' }} gap={6} justify="center" mb={10}>
        <Card flex="1" bg={cardBg} boxShadow="md" borderRadius="lg" p={4}>
          <CardHeader>
            <Text fontWeight="semibold" fontSize="lg" mb={2}>
              Select Country
            </Text>
          </CardHeader>
          <Select
            bg={selectBg}
            value={selectedCountry || ''}
            onChange={(e) => setSelectedCountry(e.target.value)}
            borderRadius="md"
            size="md"
            _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3182ce' }}
          >
            {countriesData?.item.map((c: any) => (
              <option key={c.id} value={c.name.toLowerCase().split(' ')[0]}>
                {c.name}
              </option>
            ))}
          </Select>
        </Card>

        <Card flex="1" bg={cardBg} boxShadow="md" borderRadius="lg" p={4}>
          <CardHeader>
            <Text fontWeight="semibold" fontSize="lg" mb={2}>
              Select Measure
            </Text>
          </CardHeader>
          <Select
            bg={selectBg}
            value={selectedMeasure}
            onChange={(e) => setSelectedMeasure(e.target.value)}
            borderRadius="md"
            size="md"
            _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3182ce' }}
          >
            {measures.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </Select>
        </Card>
      </Flex>

      <Card bg={cardBg} boxShadow="lg" borderRadius="xl" p={6} minH="420px">
        {cubeLoading && (
          <Flex justify="center" align="center" h="100%">
            <Spinner size="xl" />
          </Flex>
        )}

        {cubeError && (
          <Text color="red.500" fontSize="lg" textAlign="center">
            Error loading data
          </Text>
        )}

        {cubeData && cubeData.cube_cube_M6Lh5is0FtqUhZ.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={cubeData.cube_cube_M6Lh5is0FtqUhZ}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3182CE"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          !cubeLoading && (
            <Text fontSize="lg" textAlign="center" mt={10}>
              No data available for this selection.
            </Text>
          )
        )}
      </Card>
    </Box>
  );
}