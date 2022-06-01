package redis

import(
	"github.com/gomodule/redigo/redis"
)

var Con redis.Conn

func InitLocal() {
    const Addr = "localhost:6379"

	var err error
    Con, err = redis.Dial("tcp", Addr)
    if err != nil {
        panic(err)
    }
}

func InitProd() {
    const Addr = "localhost:6379"

	var err error
    Con, err = redis.Dial("tcp", Addr)
    if err != nil {
        panic(err)
    }
}

// データの登録(Redis: SET key value)
func Set(key, value string) string{
    res, err := redis.String(Con.Do("SET", key, value))
    if err != nil {
        panic(err)
    }
    return res
}
// データの取得(Redis: GET key)
func Get(key string) (string, error) {
    res, err := redis.String(Con.Do("GET", key))
    return res, err
}
