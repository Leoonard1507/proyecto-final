// Esto sirve de configuración inicial para llamar a la API de las pelícukas y no tener que 
// que ponerlo en todos los codigos

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,  // Aquí es donde usas la variable de entorno
  },
});

export default axiosInstance;
