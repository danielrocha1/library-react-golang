package main

import (
	"database/sql"
	"dbGo/worker"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// Configuração do banco de dados
const (
	DBUsername = "rocha"
	DBPassword = "D@n1elrocha"
	DBName     = "dsoftwarehouse"
)

var db *sql.DB
var err error

func init() {
	// Inicialização do banco de dados
	db, err = sql.Open("mysql", DBUsername+":"+DBPassword+"@tcp(localhost:3306)/"+DBName)
	if err != nil {
		log.Fatal(err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
}
func main() {
	selectChannel := make(chan int)
	updateChannel := make(chan map[string]interface{})
	deleteChannel := make(chan int)
	insertChannel := make(chan map[string]interface{})

	for i := 0; i < 4; i++ {
		go worker.SelectUserWorker(db, i, selectChannel)
		go worker.UpdateWorker(db, i, updateChannel)
		go worker.DeleteWorker(db, i, deleteChannel)
	
		// go worker.InsertLoanWorker(db, i, insertChannel, )
	}

	for {
		fmt.Println("Escolha a operação (1: Select, 2: Update, 3: Delete, 4: Insert 0: Sair):")
		var choice int
		fmt.Scan(&choice)

		if choice == 0 {
			close(selectChannel)
			close(updateChannel)
			close(deleteChannel)
			close(insertChannel)
			os.Exit(0)
		}

		// insertInput := map[string]interface{}{
		// 	"table":"userInfo",
		//     "nome":  "Daniel",
		//     "idade": 25,
		//     "email": "daniel@example.com",
		// }

		// insertProductInput := map[string]interface{}{
		//     "name":  "Harry Potter - e a Pedra Filosofal",
		//     "price": 25.50,
		//     "qtd": 5,
		// }
		insertLoanInput := map[string]interface{}{
		
			"UserID":            9,
			"ProdutoID":         2,
			"DataEmprestimo":    time.Now().Format("2006-01-02"),                         
			"DataDevolucao":     time.Now().Add(5 * 24 * time.Hour).Format("2006-01-02"), 
			"StatusDeDevolucao": "Pendente",
			"Expirado":          false,
		}

		updateProductInput := map[string]interface{}{
			"id":    1,
			"table": "productInfo",
			"qtd":   50,
		}

		switch choice {
		case 1:
			selectChannel <- 0
			time.Sleep(time.Second * 2)
		case 2:
			updateChannel <- updateProductInput

			time.Sleep(time.Second * 2)
		case 3:
			fmt.Println("Digite o ID:")
			var id int
			fmt.Scan(&id)
			deleteChannel <- id

			time.Sleep(time.Second * 2)
		case 4:
			insertChannel <- insertLoanInput

			time.Sleep(time.Second * 2)
		default:
			fmt.Println("Opção inválida. Tente novamente.")
		}
	}
}
