const express = require('express')
const cors = require('cors') 
const esClient = require('./client')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MELAKUKAN TEST APAKAH ELASTICSEARCH SEDANG BERJALAN ATAU TIDAK
app.get('/ping', (req, res, next) => {
  esClient.ping(
    {
      // ping usually has a 3000ms timeout
      requestTimeout: 1000
    },
    function (error) {
      if (error) {
        next('elasticsearch cluster is down!')
      } else {
        res.send('All is well')
      }
    }
  )
})

// MENGINDEKS ATAU INSERT DATA / DOKUMEN KE DALAM ELASTICSEARCH 
// Pengindeksan Data pada dasarnya berarti memasukkan data ke dalam Elasticsearch.
// contoh req.body:
// {
// 	"indexName": "blog",
// 	"mappingType": "posts",
// 	"documentBody": {
// 		"title": "Learn elastic search by ramadesi",
// 	  "tags": ["NodeJS", "Programming"],
//   	"body" : "Lot of content here..."
// 	}
// }
app.post('/insert', (req, res, next) => {
  const { indexName, mappingType, documentBody } = req.body

  esClient
    .index({
      index: indexName,
      type: mappingType,
      // ketika create document, kita bisa menggunakan id atau tanpa menggunakan id.
      // jika tanpa menggunakan id makan elasticsearch akan menggenerate id secara otomatis
      // id: 'id'
      body: documentBody
    })
    .then((resp) => {
      console.log(resp, 'INI HASILNYA')
      res.send(resp)
    })
    .catch(next)
})

// MELAKUKAN UPDATE PADA SUATU DOKUMEN
// syntax ketika melakukan update pada suatu document sama dengan ketika kita insert dengan menggunakan id

// contoh req.body:
// {
// 	"indexName": "blog",
// 	"mappingName": "posts",
// 	"id": "ZJZyd3IBQ9fRW0GaAIa5",
// 	"documentBody": {
// 		"title": "Learn elastic search by ramadesi",
// 	  "tags": ["NodeJS", "Programming"],
//   	"body" : "Lot of content here..."
// 	}
// }
app.post('/update', (req, res, next) => {
  const { indexName, mappingType, id, documentBody } = req.body
  esClient
    .index({
      index: indexName,
      type: mappingType,
      id: id,
      body: documentBody
    })
    .then((resp) => {
      res.send(resp)
    })
    .catch(next)
})

// MELAKUKAN PENCARIAN SEDERHANA DI ELASTICSEARCH

// contoh req.body :
// {
// 	"indexName": "blog",
// 	"mappingName": "posts",
// 	"payload": {
//      "query": {
//        "match": {
//          "title": "Learn"
//        }
//      }
//    }
// }

app.post('/search', (req, res, next) => {
  const { indexName, mappingType, payload } = req.body
  esClient
    .search({
      index: indexName,
      type: mappingType,
      body: payload
    })
    .then((resp) => {
      res.send(resp)
    })
    .catch(next)
})

// MELAKUKAN PENCARIAN SAAT KITA MENGETIK
// Pencarian elastis memiliki berbagai variasi pencarian,
// pada contoh sebelumnya pencarian akan cocok dengan seluruh kata yang dilewatkan dalam kueri,
// sehingga artikel yang memiliki kata 'Learn' dalam judul akan ditampilkan.
// Tetapi jika Anda mencoba mengubahnya menjadi `L` atau‘ Lear ’,
// itu tidak akan memberi hasil apa pun.

// Untuk mengatasi jenis kueri ini kita bisa menggunakan match_phrase_prefix.
// Ini membantu dalam mengembalikan hasil pencarian saat Anda mengetik pencarian Anda.
// Contoh yang sering kita temui adalah seperti saat kita mencari sesuatu di google.

// contoh req.body:

// {
// 	"indexName": "blog",
// 	"mappingName": "posts",
// 	"payload": {
//      "query": {
//        "match_phrase_prefix": { 
//          "title": "Lea"
//        }
//      }
//    }
// }

// match_phrase_prefix = match tanpa harus 1 kata lengkap 

app.post('/searchasyoutype', (req, res, next) => {
  const { indexName, mappingType, payload } = req.body

  esClient
    .search({
      index: indexName,
      type: mappingType,
      body: payload
    })
    .then((resp) => {
      res.send(resp)
    })
    .catch(next)
})

// AGREGRASI DALAM PENCARIAN ELASTICSEARCH
// Ini adalah salah satu jenis pencarian terpenting yang tersedia di Elasticsearch.
// Jika Anda pernah menggunakan amazon untuk membeli sesuatu
// biasanya ketika kita melakukan pencarian akan muncul seperti berikut:
// "Keyboard di Aksesoris Komputer", "pisau di Peralatan Dapur"
// contoh lainnya adalah, muncul kategori beserta jumlahnya seperti Windows (10), Ubuntu (4).

// contoh req.body :

// {
// 	"indexName": "blog",
// 	"mappingName": "posts",
// 	"payload": {
//      "query": {
//        "match_phrase_prefix": {
//          "title": "Lea"
//        }
//      },
// 		"aggs": {
//        "tags": {
//          "terms": {
//            "field": "tags"
//          }
//        }
//      }
//    }
// }
app.post('/searchwithaggregation', (req, res, next) => {
  const { indexName, mappingType, payload } = req.body

  esClient
    .search({
      index: indexName,
      type: mappingType,
      body: payload
    })
    .then((resp) => {
      res.send(resp)
    })
    .catch(next)
})

// MENGHAPUS DOKUMEN DARI INDEX
// contoh req.body :
// {
// 	"indexName": "blog",
// 	"mappingName": "posts",
// 	"id" : "ZJZyd3IBQ9fRW0GaAIa5"
// }

app.post('/delete', (req, res, next) => {
  const { indexName, mappingType, id } = req.body
  esClient
    .delete({
      index: indexName,
      type: mappingType,
      id: id
    })
    .then((resp) => {
      console.log(resp, 'deleted')
      res.send(resp)
    })
    .catch(next)
})

app.use((err, req, res, next) => {
  res.send(err)
})

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
)
