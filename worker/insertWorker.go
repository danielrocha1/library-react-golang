package worker

import (
	"fmt"
	"log"
	"database/sql"
"time"
"net/http"

)




type ResponseLoanInfo struct {
	UserID    int    	   `json:"UserID"`
	ProdutoID    []int  `json:"ProdutoID"`
	RequestBooks int `json:"RequestBooks"`
	
}


func InsertUserWorker(db *sql.DB, workerID int, insertChannel chan map[string]interface{}) {
			for info := range insertChannel {
				// Exemplo de Insert
				query := fmt.Sprintf("INSERT INTO %s (nome, idade, email) VALUES (?, ?, ?)", info["table"])
				result, err := db.Exec(query, info["nome"], info["idade"], info["email"])
				if err != nil {
					log.Println(err)
					continue
				}
				id, _ := result.LastInsertId()
				fmt.Printf("WorkerID %d: Insert realizado - ID inserido: %d\n", workerID+1, id)
		
	}
}

func InsertProductWorker(db *sql.DB, workerID int, insertChannel chan map[string]interface{}) {
	for info := range insertChannel {
		// Exemplo de Insert
		query := fmt.Sprintf("INSERT INTO productInfo (name, price, qtd) VALUES (?, ?, ?)")
		result, err := db.Exec(query, info["name"], info["price"], info["qtd"])
		if err != nil {
			log.Println(err)
			continue
		}
		id, _ := result.LastInsertId()
		fmt.Printf("WorkerID %d: Insert realizado - ID inserido: %d\n", workerID+1, id)
	}
}

// InsertLoanWorker insere empréstimos na tabela TabelaEmprestimos
func InsertLoanWorker(db *sql.DB, workerID int, insertChannel chan map[string]interface{}, w http.ResponseWriter) {

	for finish := range insertChannel {
		userID, ok := finish["UserID"].(int)
		if !ok {
			log.Println("Erro ao obter UserID do canal")
			continue
		}

		produtoIDs, ok := finish["ProdutoID"].([]int)
		if !ok {
			log.Println("Erro ao obter ProdutoID do canal")
			continue
		}

		requestBooks, ok := finish["RequestBooks"].(int)
		if !ok {
			log.Println("Erro ao obter RequestBooks do canal")
			continue
		}

		for _, productID := range produtoIDs {
			// Exemplo de Insert
			query := fmt.Sprintf("INSERT INTO TabelaEmprestimos (UserID, ProdutoID, DataEmprestimo, DataDevolucao, StatusDeDevolucao, Expirado) VALUES (?, ?, ?, ?, ?, ?)")
			result, err := db.Exec(query, userID, productID, time.Now().Format("2006-01-02"), time.Now().Add(5*24*time.Hour).Format("2006-01-02"), "Pendente", false)
			if err != nil {
				log.Println(err)
				continue
			}
			id, _ := result.LastInsertId()
			fmt.Printf("WorkerID %d: Insert realizado - ID inserido: %d\n", workerID+1, id)

			_, err = db.Exec("UPDATE userInfo SET atualLivros = ? WHERE id = ?", requestBooks, userID)
			if err != nil {
				log.Println(err)
				continue
			}
		}
	}
}