package worker

import (
	"database/sql"
	"fmt"
	"log"
	

	
)

const (
	DBUsername = "daniel"
	DBPassword = "daniel1010"
	DBName     = "dsoftwarehouse"
)




func DeleteWorker(db *sql.DB, workerID int, deleteChannel chan int) {
	for x := range deleteChannel {
		// Exemplo de Delete
		_, err := db.Exec("DELETE FROM userInfo WHERE id = ?", x)
		if err != nil {
			log.Println(err)
			continue
		}
		fmt.Printf("WorkerID %d: Delete realizado - ID: %d\n", workerID+1, x)

	}
}
