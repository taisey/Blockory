package api

import (
	"log"
	"net/http"
)

//root-handle
func RootHandle(w http.ResponseWriter, r *http.Request) {
	log.Println("RootHandle active!!")
}
