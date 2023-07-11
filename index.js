const axios = require("axios");
const server = require("./src/server");
const { conn, Country } = require("./src/db.js");
const { countriesAPI } = require("./src/http/axiosInstance");
const PORT = 3001;

conn
  .sync({ force: false })
  .then(() => {
    server.listen(PORT, async () => {
      console.log(`Server listening on port ${PORT}`);
      try {
        // Verificar si la tabla de paises tiene informacion. Si no tiene se realiza request
        const totalCountries = await Country.findAll({ raw: true });
        if (totalCountries.length > 0) {
          return;
        }

        const { data } = await countriesAPI();

        const promises = data.map(async (country) => {
          const {
            name,
            flags,
            continents,
            capital,
            subregion,
            area,
            population,
            cca3,
          } = country;
          const { official } = name;
          const { png } = flags;
          // const { spa } = translations;

          return await Country.create({
            name: official,
            shortName: cca3,
            flagImageUrl: png,
            continent: continents[0],
            capital: capital ? capital[0] : "",
            subregion: subregion ? subregion : "",
            area,
            population,
          });
        });
        console.log("Guardando paises en la base de datos...");
        await Promise.all(promises);
        console.log("Paises guardados correctamente");
      } catch (error) {
        console.log(error);
      }
    });
  })
  .catch((error) => console.error(error));
