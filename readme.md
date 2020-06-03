# Elasticsearch

**Elasticsearch** adalah salah satu database yang masuk ke dalam NoSQL dengan fokus di search engine database. Elasticsearch ditenagai oleh Apache Lucene yang juga merupakan search engine database yang memiliki query low level. Elasticsearch memiliki query yang lebih mudah untuk digunakan karena berbasis RESTful

**Elasticsearh** memiliki konsep yang dapat mengasumsikan **indeks** sebagai **"database"**, **types** sebagai **"tabel"** dan **dokumen** sebagai **record** atau **row**. Sedangkan mapping dapat diasumsikan sebagai "skema tabel". Di Elasticsearch tidak ada transaction dan dapat membuat struktur indeks tergantung dengan kebutuhan kita. Selain itu dapat diatur untuk menjadi sebuah sistem terdistribusi terhadap sejumlah server.

**Kelebihan Elasticsearch**

a. Elasticserach mengunakan RESTful pada saat CRUD operation, sehingga jika anda menggunakan elasticsearch maka anda secara tidak langsung sudah mempunyai API, yang telah dibuatkan oleh elasticsearch dan anda tinggal gunakan.

b. Database Model Elasticsearch adalah Search Engine


**Step 1 — Installing Elasticsearch**

    1. $ curl -fsSL https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

    2. $ echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list

    3. $ sudo apt update

    4. $ sudo apt install elasticsearch

**Step 2 — Enable Elasticsearch**

    5. $ sudo systemctl start elasticsearch

    6. $ sudo systemctl enable elasticsearch

**Step 3 — Testing Elasticsearch**

    7. $ curl -X GET http://localhost:9200/?pretty=true

*      Output :
      {
        "name" : "xc0de",
        "cluster_name" : "elasticsearch",
        "cluster_uuid" : "xbTdE490SBmOgS1xbrLpWg",
        "version" : {
          "number" : "7.7.0",
          "build_flavor" : "default",
          "build_type" : "deb",
          "build_hash" : "81a1e9eda8e6183f5237786246f6dced26a10eaf",
          "build_date" : "2020-05-12T02:01:37.602180Z",
          "build_snapshot" : false,
          "lucene_version" : "8.5.1",
          "minimum_wire_compatibility_version" : "6.8.0",
          "minimum_index_compatibility_version" : "6.0.0-beta1"
        },
        "tagline" : "You Know, for Search"
      }

**Step 4 — Using Elasticsearch**

Untuk mulai menggunakan Elasticsearch, buat indeks baru terlebih dahulu.

**Membuat Indeks Baru**

    1. $ curl -X PUT localhost:9200/store

    2. $ curl -XGET http://localhost:9200/store?pretty=true

*      Output:
      {
        "store" : {
          "aliases" : { },
          "mappings" : { },
          "settings" : {
            "index" : {
              "creation_date" : "1591136641673",
              "number_of_shards" : "1",
              "number_of_replicas" : "1",
              "uuid" : "2DFKLfiOTE2qp38-ZTwiKw",
              "version" : {
                "created" : "7070099"
              },
              "provided_name" : "store"
            }
          }
        }
      }

Bila buat indeks yang sama akan muncul error seperti :

      $ curl -XPUT http://localhost:9200/store?pretty=true

*     Output:
      {
      "error" : {
          "root_cause" : [
            {
              "type" : "index_already_exists_exception",
              "reason" : "index [store/bwpm0ie5Q52-Hz4EM4T0-g] already exists",
              "index_uuid" : "bwpm0ie5Q52-Hz4EM4T0-g",
              "index" : "store"
            }
          ],
          "type" : "index_already_exists_exception",
          "reason" : "index [store/bwpm0ie5Q52-Hz4EM4T0-g] already exists",
          "index_uuid" : "bwpm0ie5Q52-Hz4EM4T0-g",
          "index" : "store"
        },
        "status" : 400
      }
    
Untuk menghapus sebuah indeks dilakukan dengan :

      $ curl -XDELETE http://localhost:9200/store?pretty=true

*     Output:
      {
        "acknowledged" : true
      }

Silahkan buat kembali indeks store dan seperti yang terlihat, disana _/mappings_/-nya masih kosong karena belum membuat types. Sekarang pasang mapping berikut dengan menggunakan Curl:


      $ curl -XPUT -H "Content-Type: application/json" http://localhost:9200/store?pretty=true -d '{"mappings":{"games":{"properties":{"title":{"type":"text"},"description":{"type":"text"},"rating":{"type":"float"},"published_at":{"type":"date"}}}}}'

*     Output:
      {
        "acknowledged" : true,
        "shards_acknowledged" : true,
        "index" : "store"
      }

Sekarang dapat memeriksa mapping yang sudah baru dibuat terhadap indeks **store** dimana tadi telah ditambahkan  types **games**:

      $ curl -XGET http://localhost:9200/store?pretty=true

*     Output:
      {
        "store" : {
          "aliases" : { },
          "mappings" : { },
          "settings" : {
            "index" : {
              "creation_date" : "1591138512473",
              "number_of_shards" : "1",
              "number_of_replicas" : "1",
              "uuid" : "p2mnUMjHSSqcGqjY1cKfTA",
              "version" : {
                "created" : "7070099"
              },
              "provided_name" : "store"
            }
          }
        }
      }
  
Elasticsearch menggunakan API RESTful, yang dapat menanggapi perintah CRUD yang biasa:

**Menambah Dokumen Baru/POST** 

      $ curl -XPOST -H "Content-Type: application/json" http://localhost:9200/store/games/1?pretty=true -d '{"title":"Frozen Free Fall", "description":"sebuah game mencocokkan yang dibuat dengan mengadaptasi Disney Frozen", "rating":4.8, "published_at":"2016-01-05"}'

*     Output:
      {
        "_index" : "store",
        "_type" : "games",
        "_id" : "1",
        "_version" : 1,
        "result" : "created",
        "_shards" : {
          "total" : 2,
          "successful" : 1,
          "failed" : 0
        },
        "_seq_no" : 0,
        "_primary_term" : 1
      }


Hasil GET dari data baru  

      $ curl -XGET http://localhost:9200/store/games/_search?pretty=true

*     Output:
      {
        "took" : 162,
        "timed_out" : false,
        "_shards" : {
          "total" : 1,
          "successful" : 1,
          "skipped" : 0,
          "failed" : 0
        },
        "hits" : {
          "total" : {
            "value" : 1,
            "relation" : "eq"
          },
          "max_score" : 1.0,
          "hits" : [
            {
              "_index" : "store",
              "_type" : "games",
              "_id" : "1",
              "_score" : 1.0,
              "_source" : {
                "title" : "Frozen Free Fall",
                "description" : "sebuah game mencocokkan yang dibuat dengan mengadaptasi Disney Frozen",
                "rating" : 4.8,
                "published_at" : "2016-01-05"
              }
            }
          ]
        }
      }
    
Bila menimpanya, maka akan membuat dokumen tersebut menjadi versi terbaru.


contoh POST yang lain :

      $ curl -XPOST -H "Content-Type: application/json" 'http://localhost:9200/tutorial/helloworld/1' -d '{ "message": "Hello World!" }'

*   Output:
    { 
      "_index":"tutorial",
      "_type":"helloworld",
      "_id":"1","_version":2,
      "result":"updated",
      "_shards":{"total":2,"successful":1,"failed":0},
      "_seq_no":1,"_primary_term":1
    }


**GET** 

      $ curl -XGET http://localhost:9200/store/games/_search?pretty=true

*     Output:
      {
        "took" : 4,
        "timed_out" : false,
        "_shards" : {
          "total" : 1,
          "successful" : 1,
          "skipped" : 0,
          "failed" : 0
        },
        "hits" : {
          "total" : {
            "value" : 1,
            "relation" : "eq"
          },
          "max_score" : 1.0,
          "hits" : [
            {
              "_index" : "store",
              "_type" : "games",
              "_id" : "1",
              "_score" : 1.0,
              "_source" : {
                "title" : "Frozen Free Fall",
                "description" : "sebuah game mencocokkan yang dibuat dengan mengadaptasi Disney Frozen",
                "rating" : 4.8,
                "published_at" : "2016-01-05"
              }
            }
          ]
        }
      }  

**GET by Id** 

      $ curl -XGET http://localhost:9200/store/games/1?pretty=true

*     Output:
      {
        "_index" : "store",
        "_type" : "games",
        "_id" : "1",
        "_version" : 1,
        "_seq_no" : 0,
        "_primary_term" : 1,
        "found" : true,
        "_source" : {
          "title" : "Frozen Free Fall",
          "description" : "sebuah game mencocokkan yang dibuat dengan mengadaptasi Disney Frozen",
          "rating" : 4.8,
          "published_at" : "2016-01-05"
        }
      }
  

Dapat juga dengan **filtering** pada field title atau description seperti berikut: 

**Filter by description**

      $ curl -XGET -H "Content-Type: application/json" http://localhost:9200/store/games/_search?pretty=true -d '{"query":{"match":{"description":"Disney"}}}'

*     Output:
      {
        "took" : 2,
        "timed_out" : false,
        "_shards" : {
          "total" : 1,
          "successful" : 1,
          "skipped" : 0,
          "failed" : 0
        },
        "hits" : {
          "total" : {
            "value" : 1,
            "relation" : "eq"
          },
          "max_score" : 0.2876821,
          "hits" : [
            {
              "_index" : "store",
              "_type" : "games",
              "_id" : "1",
              "_score" : 0.2876821,
              "_source" : {
                "title" : "Frozen Free Fall",
                "description" : "sebuah game mencocokkan yang dibuat dengan mengadaptasi Disney Frozen",
                "rating" : 4.8,
                "published_at" : "2016-01-05"
              }
            }
          ]
        }
      }

**Filter by title**

      $ curl -XGET -H "Content-Type: application/json" http://localhost:9200/store/games/_search?pretty=true -d '{"query":{"match":{"title":"Frozen"}}}'

*     Output:
      {
        "took" : 2,
        "timed_out" : false,
        "_shards" : {
          "total" : 1,
          "successful" : 1,
          "skipped" : 0,
          "failed" : 0
        },
        "hits" : {
          "total" : {
            "value" : 1,
            "relation" : "eq"
          },
          "max_score" : 0.2876821,
          "hits" : [
            {
              "_index" : "store",
              "_type" : "games",
              "_id" : "1",
              "_score" : 0.2876821,
              "_source" : {
                "title" : "Frozen Free Fall",
                "description" : "sebuah game mencocokkan yang dibuat dengan mengadaptasi Disney Frozen",
                "rating" : 4.8,
                "published_at" : "2016-01-05"
              }
            }
          ]
        }
      }

Dengan curl, kita mengirim request HTTP POST/GET/PUT/DELETE ke server Elasticsearch. req URI adalah / store / games / 1 dengan beberapa parameter:

* store adalah indeks data di Elasticsearch.
* games adalah tipenya.
* 1 adalah ID dari entri di bawah indeks dan tipe di atas.


**PUT**

      $ curl -X PUT -H "Content-Type: application/json"  'localhost:9200/store/games/1?pretty' -d '{ "title": "Hello, Frozen Free Fall!"}'

*      Output:
      {
      "_index" : "store",
      "_type" : "games",
      "_id" : "1",
      "_version" : 2,
      "result" : "updated",
      "_shards" : {
        "total" : 2,
        "successful" : 1,
        "failed" : 0
      },
      "_seq_no" : 1,
      "_primary_term" : 1
      }

**DELETE**

      $ curl -XDELETE http://localhost:9200/store/games/1?pretty=true

*     Output:
      {
        "found" : true,
        "_index" : "store",
        "_type" : "games",
        "_id" : "1",
        "_version" : 8,
        "result" : "deleted",
        "_shards" : {
          "total" : 2,
          "successful" : 1,
          "failed" : 0
        }
      } 
