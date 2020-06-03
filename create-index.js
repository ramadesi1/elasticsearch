// MEMBUAT INDEX/DATABASE PADA ELASTIC SEARCH
// Indeks dalam Elasticsearch dianalogikan dengan basis data di mesin penyimpanan lain / Database lain
// (misalnya: MongoDB).

const esClient = require('./client')
// const createIndex = async function (indexName) { //function untuk membuat nama database
//   return await esClient.indices.create({
//     index: indexName 
//   })
// }

// async function migrate() {
//   try {
//     const resp = await createIndex('blog')
//     console.log(resp)
//   } catch (e) {
//     console.log(e)
//   }
// }
// migrate()

function createIndex(indexName) { //function untuk membuat nama database
    return new Promise((resolve, reject) => { 
        esClient.indices.create({
            index: indexName 
          })
          .then(resp => {
              resolve(resp)
          })
          .catch(reject)
    })
    
}
  
function migrate() {
    createIndex('blog')
    .then(resp => {
        console.log(resp, 'berhasil')
    })
    .catch(err => {
        console.log(err, 'error')
    })
}
migrate()