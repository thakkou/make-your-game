package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"sync"
)

type Entry struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  string `json:"time"` // mm:ss
}

type PostResponse struct {
	Rank       int     `json:"rank"`
	Total      int     `json:"total"`
	Percentile float64 `json:"percentile"`
	Scores     []Entry `json:"scores"`
}

type GetResponse struct {
	Page       int     `json:"page"`
	TotalPages int     `json:"total_pages"`
	Total      int     `json:"total"`
	Scores     []Entry `json:"scores"`
}

const (
	dataFile = "data/scores.json"
	pageSize = 5
)

var (
	mu     sync.RWMutex
	scores []Entry
)

// handleGet returns paginated scores
// Query params: page (default 1)
func handleGet(w http.ResponseWriter, r *http.Request) {
	page := 1
	if p := r.URL.Query().Get("page"); p != "" {
		if n, err := strconv.Atoi(p); err == nil && n > 0 {
			page = n
		}
	}

	mu.RLock()
	ranked := sortByScore(scores)
	mu.RUnlock()

	total := len(ranked)
	totalPages := (total + pageSize - 1) / pageSize
	if totalPages == 0 {
		totalPages = 1
	}
	if page > totalPages {
		page = totalPages
	}

	start := (page - 1) * pageSize
	end := start + pageSize
	if end > total {
		end = total
	}

	resp := GetResponse{
		Page:       page,
		TotalPages: totalPages,
		Total:      total,
		Scores:     ranked[start:end],
	}

	writeJSON(w, http.StatusOK, resp)
}

func handlePost(w http.ResponseWriter, r *http.Request) {
	var entry Entry
	if err := json.NewDecoder(r.Body).Decode(&entry); err != nil {
		http.Error(w, "invalid JSON body", http.StatusBadRequest)
		return
	}

	if entry.Name == "" {
		http.Error(w, "name is required", http.StatusBadRequest)
		return
	}
	if entry.Score < 0 {
		http.Error(w, "score must be non-negative", http.StatusBadRequest)
		return
	}
	if !isValidTime(entry.Time) {
		http.Error(w, `time must be in "MM:SS" format`, http.StatusBadRequest)
		return
	}

	mu.Lock()
	scores = append(scores, entry)
	ranked := sortByScore(scores)
	if err := saveToFile(); err != nil {
		log.Printf("error saving scores: %v", err)
	}
	mu.Unlock()

	// find rank (last one with this score+name wins tie)
	rank := 1
	for i, e := range ranked {
		if e.Name == entry.Name && e.Score == entry.Score {
			rank = i + 1
			break
		}
	}

	total := len(ranked)
	below := 0
	for _, re := range ranked {
		if re.Score < entry.Score {
			below++
		}
	}
	percentile := 0.0 // percentage of players below submitted score
	if total > 1 {
		percentile = float64(below) / float64(total-1) * 100
	}

	// top 5
	top := ranked
	if len(top) > pageSize {
		top = top[:pageSize]
	}

	resp := PostResponse{
		Rank:       rank,
		Total:      total,
		Percentile: percentile,
		Scores:     top,
	}

	writeJSON(w, http.StatusCreated, resp)
}

func sortByScore(entries []Entry) []Entry {
	sorted := make([]Entry, len(entries))
	copy(sorted, entries)
	sort.Slice(sorted, func(i, j int) bool {
		return sorted[i].Score > sorted[j].Score
	})
	return sorted
}

func isValidTime(t string) bool {
	if len(t) != 5 || t[2] != ':' { // mm:ss
		return false
	}
	_, err1 := strconv.Atoi(t[:2])
	s, err2 := strconv.Atoi(t[3:])
	return err1 == nil && err2 == nil && s < 60
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		log.Printf("error writing response: %v", err)
	}
}

func saveToFile() error {
	f, err := os.Create(dataFile)
	if err != nil {
		return err
	}
	defer f.Close()
	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	return enc.Encode(scores)
}

func loadFromFile() {
	f, err := os.Open(dataFile)
	if err != nil {
		if !os.IsNotExist(err) {
			log.Printf("warning: could not open %s: %v", dataFile, err)
		}
		return
	}
	defer f.Close()
	if err := json.NewDecoder(f).Decode(&scores); err != nil {
		log.Printf("warning: could not decode %s: %v", dataFile, err)
	}
	log.Printf("Loaded %d scores from %s", len(scores), dataFile)
}
