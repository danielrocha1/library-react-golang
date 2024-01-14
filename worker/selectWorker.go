package worker

import (
	"database/sql"
	"fmt"
	"log"
	"strings"


)

// ProductInfo representa os dados de um produto
type ProductInfo struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Qtd   int     `json:"qtd"`
	Img   string  `json:"image"`
}
type User struct {
	ID       int  `json:"ID"`
	Email    string  `json:"email"`
	Password string  `json:"password"`
	Token    string   `json:"token"`
	IdUserInfo string `json:"IdUserInfo"`
	Type string `json:"type"`
	UserInfo 	UserInfo
}

type UserInfo struct {
	ID    int
	Nome  string
	Idade int
	Email string
	AtualLivros       int  `json:"atualLivros"`
	TotalLivros       int  `json:"totalLivros"`
}

type SelectLoanInput struct {
	EmprestimoID int `json:"EmprestimoID"`
	UserID int  `json:"UserID"`
	ProdutoID int `json:"ProdutoID"`
	DataEmprestimo string `json:"DataEmprestimo"`
	DataDevolucao   string `json:"DataDevolucao"`
	StatusDeDevolucao string  `json:"StatusDeDevolucao"`
	Expirado         bool  `json:"Expirado"`
}

func SelectUserWorker(db *sql.DB, WorkerID int, selectChannel chan int) {
	for range selectChannel {
		rows, err := db.Query("SELECT * FROM userInfo")
		if err != nil {
			log.Println(err)
			continue
		}
		defer rows.Close()

		// Process the results
		if !rows.Next() {
			fmt.Printf("Sem informações no banco!\n")
		}

		for rows.Next() {
			var user UserInfo
			err := rows.Scan(&user.ID, &user.Nome, &user.Idade, &user.Email)
			if err != nil {
				log.Println(err)
				continue
			}
			fmt.Printf("ID: %d, Nome: %s, Idade: %d, Email: %s\n", user.ID, user.Nome, user.Idade, user.Email)
		}

		if err := rows.Err(); err != nil {
			log.Println(err)
		}
	}
}

func LoginUserWorker(db *sql.DB, workerID int, loginChannel chan map[string]interface{}, loggedChannel chan User) {
	for loginData := range loginChannel {
		email, ok := loginData["email"].(string)
		if !ok {
			log.Println("Invalid email format")
			continue
		}

		password, ok := loginData["password"].(string)
		if !ok {
			log.Println("Invalid password format")
			continue
		}

		var user User
		// Query to select a specific user based on email
		err := db.QueryRow("SELECT * FROM User WHERE TRIM(email)=?", email).Scan(&user.ID, &user.Email, &user.Password, &user.Token,&user.IdUserInfo,&user.Type)
		if err != nil {
			if err == sql.ErrNoRows {
				log.Println("User not found")
			} else {
				log.Fatal(err)
			}
			continue
		}

		result := strings.ReplaceAll(user.Email, " ", "")

		// Check if the password matches
		if (result == email && user.Password == password){
			err := db.QueryRow("SELECT * FROM userInfo where id=?",user.IdUserInfo).Scan(&user.UserInfo.ID, &user.UserInfo.Nome, &user.UserInfo.Idade, &user.UserInfo.Email, &user.UserInfo.TotalLivros ,&user.UserInfo.AtualLivros)
			if err != nil {
				if err == sql.ErrNoRows {
					fmt.Println("Nenhuma informação de UserInfo encontrada para o userID:", user.IdUserInfo)
				} else {
					log.Fatal(err)
				}
			} else {
				// UserInfo encontrado, faça o que for necessário com a struct userInfo
				fmt.Println("Informações de UserInfo encontradas:", user.UserInfo.Nome)
			}
	
			// Process the results
	
			
			fmt.Println(user)
			loggedChannel <- user
			
		}else{
			fmt.Println("Credential Incorreta")
		}
		
	}
}

func SelectProductWorker(db *sql.DB, WorkerID int, selectChannel chan int, resultChannel chan []ProductInfo) {
	for range selectChannel {
		rows, err := db.Query("SELECT * FROM productInfo")
		if err != nil {
			log.Println(err)
			continue
		}
		defer rows.Close()

		var products []ProductInfo
		for rows.Next() {
			var product ProductInfo
			err := rows.Scan(&product.ID, &product.Name, &product.Price, &product.Qtd, &product.Img)
			if err != nil {
				log.Println(err)
				continue
			}
			products = append(products, product)
		}

		if err := rows.Err(); err != nil {
			log.Println(err)
			continue
		}

		// Enviar os resultados para o canal
		resultChannel <- products
	}
}


func SelectMyBooksWorker(db *sql.DB, WorkerID int, selectChannel chan int, resultChannel chan []map[string]interface{}) {
	for userID := range selectChannel {
		query := `
			SELECT 
				e.EmprestimoID, e.UserID, e.ProdutoID, e.DataEmprestimo, e.DataDevolucao,
				e.StatusDeDevolucao, e.Expirado,
				p.ID, p.Name, p.Price, p.Qtd, p.Image
			FROM TabelaEmprestimos e
			JOIN productInfo p ON e.ProdutoID = p.ID
			WHERE e.UserID = ?
		`

		rows, err := db.Query(query, userID)
		if err != nil {
			log.Println(err)
			continue
		}
		defer rows.Close()

		var loansAndProducts []map[string]interface{}

		for rows.Next() {
			var loan SelectLoanInput
			var product ProductInfo

			err := rows.Scan(
				&loan.EmprestimoID, &loan.UserID, &loan.ProdutoID, &loan.DataEmprestimo,
				&loan.DataDevolucao, &loan.StatusDeDevolucao, &loan.Expirado,
				&product.ID, &product.Name, &product.Price, &product.Qtd, &product.Img,
			)

			if err != nil {
				log.Println(err)
				continue
			}

			loansAndProducts = append(loansAndProducts, map[string]interface{}{
				"Emprestimo": loan,
				"Product":    product,
			})
		}

		if err := rows.Err(); err != nil {
			log.Println(err)
			continue
		}

		// Enviar os resultados para o canal
		resultChannel <- loansAndProducts
	}
}

func SelectLoanWorker(db *sql.DB, WorkerID int, selectChannel chan int, resultLoanChannel chan []SelectLoanInput) {
	for range selectChannel {
		rows, err := db.Query("SELECT * FROM TabelaEmprestimos")
		if err != nil {
			log.Println(err)
			continue
		}
		defer rows.Close()

		var loans []SelectLoanInput
		for rows.Next() {
			var loan SelectLoanInput
			err := rows.Scan(&loan.EmprestimoID, &loan.UserID, &loan.ProdutoID, &loan.DataEmprestimo,
				&loan.DataDevolucao, &loan.StatusDeDevolucao, &loan.Expirado,)
			if err != nil {
				log.Println(err)
				continue
			}
			loans = append(loans, loan)
		}

		if err := rows.Err(); err != nil {
			log.Println(err)
			continue
		}

		// Enviar os resultados para o canal
		resultLoanChannel <- loans
	}
}