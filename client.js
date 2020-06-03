// MELAKUKAN KONEKSI KE ELASTICSEARCH 

const es = require('elasticsearch')
const esClient = new es.Client({
  host: 'localhost:9200',
  log: 'trace' //tampilkan log dari elastic search
})

module.exports = esClient
