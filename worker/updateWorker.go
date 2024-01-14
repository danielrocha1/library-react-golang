package worker

import(
	"fmt"
	"log"

	"database/sql"
)



func UpdateWorker(db *sql.DB, workerID int, updateChannel chan map[string]interface{}) {
	for info := range updateChannel {
		// Example of Update
		query := "UPDATE productInfo SET " + info["Field"].(string) + " = ? WHERE id = ?"
		_, err := db.Exec(query, info["Product"], info["ID"])
		if err != nil {
			log.Println(err)
			continue
		}
		fmt.Printf("WorkerID %d: Update realizado - ID: %d\n", workerID+1, info["ID"])
	}
	
}

func UpdateLoanWorker(db *sql.DB, workerID int, updateChannel chan map[string]interface{}) {
    for info := range updateChannel {
        // Example of Update
        query := "UPDATE TabelaEmprestimos SET " + info["Field"].(string) + " = ? WHERE EmprestimoID = ?"
        _, err := db.Exec(query, info["Product"], info["ID"])
        if err != nil {
            log.Println(err)
            continue
        }

        if (info["Product"] == "Devolvido"){
        query = "UPDATE userInfo SET atualLivros = atualLivros - 1 WHERE id = ?"
        _, err = db.Exec(query, info["UserID"])
        if err != nil {
            log.Println(err)
            continue
        }
    }

        fmt.Printf("WorkerID %d: Update realizado - ID: %d\n", workerID+1, info["ID"])
    }
}

