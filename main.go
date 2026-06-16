package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	loadFromFile()

	http.HandleFunc("/scores", handleScores)

	addr := ":8080"
	fmt.Printf("Scoreboard API listening on %s\n", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}

func handleScores(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	switch r.Method {
	case http.MethodGet:
		handleGet(w, r)
	case http.MethodPost:
		handlePost(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}
