package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
)

func main() {
	loadFromFile()

	http.HandleFunc("/", handleRoot)
	http.HandleFunc("/assets/", handleFiles)
	http.HandleFunc("/scripts/", handleFiles)
	http.HandleFunc("/scores", handleScores)

	addr := ":8080"
	fmt.Printf("listening on localhost%s\n", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}

func handleRoot(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "", http.StatusMethodNotAllowed)
		return
	}

	bytes, err := os.ReadFile("index.html")
	if err != nil {
		http.Error(w, "", http.StatusInternalServerError)
		return
	}

	w.Write(bytes)
}

func handleFiles(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "", http.StatusMethodNotAllowed)
		return
	}

	path := strings.Split(r.URL.Path, "/")
	if len(path) < 2 {
		http.Error(w, "", http.StatusNotFound)
		return
	}

	filePath := r.URL.Path[1:]
	info, err := os.Stat(filePath)
	if err != nil || info.IsDir() {
		http.Error(w, "", http.StatusNotFound)
		return
	}

	http.ServeFile(w, r, filePath)
}

// POST /scores — submit a new score json
// { "name": "O.J.", "score": 14356, "time": "05:40" }
// GET /scores?page=1 — fetch paginated scores
func handleScores(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	switch r.Method {
	case http.MethodGet:
		getScores(w, r)
	case http.MethodPost:
		setScores(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}
