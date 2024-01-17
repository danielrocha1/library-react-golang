package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	
	"log"
	"net/http"
	"strconv"
	"strings"

	"time"

	"dbGo/worker"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

FALSO

// ProductInfo representa os dados de um produto
type ProductInfo struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Qtd   int     `json:"qtd"`
}
type Credentials struct {
	Email    string `json:"email"`
	Password int `json:"password"`
}
type ResponseLoanInfo struct {
	UserID    int     `json:"UserID"`
	ProdutoID    []int  `json:"ProdutoID"`
	RequestBooks int `json:"RequestBooks"`
	
}
// Configuração do banco de dados
const (
	DBUsername = "rocha"
	DBPassword = "D@n1elrocha"
	DBName     = "dsoftwarehouse"
	ServerPort = ":8080"
)
var (
	db  *sql.DB
	err error
)

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
	r := mux.NewRouter()
	corsOptions := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),  // Permitir solicitações de qualquer origem
		handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	// Aplicar configuração CORS ao roteador
	r.Use(corsOptions)

	loginChannel := make(chan map[string]interface{})
	selectChannel := make(chan int)
	updateChannel := make(chan map[string]interface{})
	deleteChannel := make(chan int)
	insertChannel := make(chan map[string]interface{})
	
	
	

	// Crie um canal para receber os resultados
	resultChannel := make(chan []worker.ProductInfo)
	loggedChannel := make(chan worker.User)

	selectMyBooksChannel := make(chan int)
	myBooksChannel := make(chan []map[string]interface{})

	loanChannel := make(chan int)
	resultLoanChannel := make(chan []worker.SelectLoanInput)

	updateLoanChannel := make(chan map[string]interface{})
	
defer close(resultChannel)
var w http.ResponseWriter
for i := 0; i < 5; i++ {
    // Corrigir a chamada da função SelectProductWorker
	
    go worker.SelectProductWorker(db, i, selectChannel, resultChannel)
    go worker.UpdateWorker(db, i, updateChannel)
    go worker.DeleteWorker(db, i, deleteChannel)
    // go worker.InsertUserWorker(db, i, insertChannel)

	go worker.LoginUserWorker(db, i, loginChannel, loggedChannel)
	go worker.InsertLoanWorker(db, i, insertChannel, w)

	go worker.SelectLoanWorker(db, i, loanChannel, resultLoanChannel)	
    go worker.SelectMyBooksWorker(db, i, selectMyBooksChannel, myBooksChannel)	

	go worker.UpdateLoanWorker(db, i, updateLoanChannel)

}



r.HandleFunc("/login/", func(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        w.WriteHeader(http.StatusOK)
        return
    }
	err := r.ParseForm()
	if err != nil {
		log.Println("Erro ao analisar dados do formulário:", err)
		http.Error(w, "Erro ao analisar dados do formulário", http.StatusInternalServerError)
		return
	}

	// Obtenha os valores dos campos do formulário
	

	loginInput := make(map[string]interface{})

	loginInput["email"] = r.Form.Get("email")
	loginInput["password"] = r.Form.Get("password")
    
    loginChannel <- loginInput
    login := <-loggedChannel

    jsonData, err := json.Marshal(login)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(jsonData, )
}).Methods("GET", "OPTIONS")


r.HandleFunc("/select", func(w http.ResponseWriter, r *http.Request) {
    // Verificar se a solicitação é um OPTIONS (usado para preflight CORS)
    if r.Method == http.MethodOptions {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        w.WriteHeader(http.StatusOK)
        return
    }

    // Restante do código para tratamento do método GET
    selectChannel <- 0
    products := <-resultChannel

    jsonData, err := json.Marshal(products)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(jsonData)
}).Methods("GET", "OPTIONS")


r.HandleFunc("/selectLoan", func(w http.ResponseWriter, r *http.Request) {
    // Verificar se a solicitação é um OPTIONS (usado para preflight CORS)
    if r.Method == http.MethodOptions {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        w.WriteHeader(http.StatusOK)
        return
    }

    // Restante do código para tratamento do método GET
    loanChannel <- 0
    products := <-resultLoanChannel

    jsonData, err := json.Marshal(products)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(jsonData)
}).Methods("GET", "OPTIONS")


r.HandleFunc("/update/", func(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.WriteHeader(http.StatusOK)
		return
	}

	err := r.ParseForm()
	if err != nil {
		log.Println("Erro ao analisar dados do formulário:", err)
		http.Error(w, "Erro ao analisar dados do formulário", http.StatusInternalServerError)
		return
	}

	// Obtenha os valores dos campos do formulário
	updateInput := make(map[string]interface{})
	updateInput["Field"] = r.Form.Get("Field")
	updateInput["Product"] = r.Form.Get("Product")
	updateInput["ID"] = r.Form.Get("ID")

	updateChannel <- updateInput
	
	time.Sleep(time.Second * 1)

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, updateInput)
}).Methods("PUT", "OPTIONS")

r.HandleFunc("/delete/{id}", func(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	deleteChannel <- id
	time.Sleep(time.Second * 1)
	fmt.Fprint(w, "Delete request received for ID:", id)
}).Methods("DELETE")

r.HandleFunc("/insertLoan/", func(w http.ResponseWriter, r *http.Request) {
    if r.Method == http.MethodOptions {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        w.WriteHeader(http.StatusOK)
        return
    }
    err := r.ParseForm()
    if err != nil {
        log.Println("Erro ao analisar dados do formulário:", err)
        http.Error(w, "Erro ao analisar dados do formulário", http.StatusInternalServerError)
        return
    }

    // Criar uma instância de ResponseLoanInfo
	finish := make(map[string]interface{})

		// Obtenha os valores dos campos do formulário
		userID, err := strconv.Atoi(r.Form.Get("UserID"))
		if err != nil {
			log.Println("Erro ao converter UserID para int:", err)
			http.Error(w, "Erro ao converter UserID para int", http.StatusInternalServerError)
			return
		}
		finish["UserID"] = userID
		
		// Pode ser necessário fazer um parsing dos IDs dependendo do formato
		produtoIDsStr := strings.Split(r.Form.Get("ProdutoID"), ",")
		produtoIDs := make([]int, len(produtoIDsStr))
		for i, idStr := range produtoIDsStr {
			id, err := strconv.Atoi(idStr)
			if err != nil {
				log.Println("Erro ao converter ProdutoID para int:", err)
				http.Error(w, "Erro ao converter ProdutoID para int", http.StatusInternalServerError)
				return
			}
			produtoIDs[i] = id
		}
		finish["ProdutoID"] = produtoIDs
		requestBooks, err := strconv.Atoi(r.Form.Get("RequestBooks"))
		if err != nil {
			log.Println("Erro ao converter RequestBooks para int:", err)
			http.Error(w, "Erro ao converter RequestBooks para int", http.StatusInternalServerError)
			return
		}
		finish["RequestBooks"] = requestBooks


		insertChannel <- finish

		time.Sleep(time.Second * 1)
		fmt.Fprint(w, "Insert request received")
	}).Methods("POST")




	r.HandleFunc("/selectMybooks/", func(w http.ResponseWriter, r *http.Request) {
		// Verificar se a solicitação é um OPTIONS (usado para preflight CORS)
		if r.Method == http.MethodOptions {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.WriteHeader(http.StatusOK)
			return
		}
	
		err := r.ParseForm()
		if err != nil {
			log.Println("Erro ao analisar dados do formulário:", err)
			http.Error(w, "Erro ao analisar dados do formulário", http.StatusInternalServerError)
			return
		}
	
		// Criar uma instância de ResponseLoanInfo
	
			// Obtenha os valores dos campos do formulário
			userID, err := strconv.Atoi(r.Form.Get("UserID"))
			if err != nil {
				log.Println("Erro ao analisar dados do formulário:", err)
				http.Error(w, "Erro ao analisar dados do formulário", http.StatusInternalServerError)
				return
			}
			fmt.Println(userID)
			

		// Restante do código para tratamento do método GET
		selectMyBooksChannel <- userID
		products := <-myBooksChannel
	
		jsonData, err := json.Marshal(products)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonData)
		
	}).Methods("GET", "OPTIONS")



	r.HandleFunc("/updateLoan/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.WriteHeader(http.StatusOK)
			return
		}
	
		err := r.ParseForm()
		if err != nil {
			log.Println("Erro ao analisar dados do formulário:", err)
			http.Error(w, "Erro ao analisar dados do formulário", http.StatusInternalServerError)
			return
		}
	
		// Obtenha os valores dos campos do formulário
		updateInput := make(map[string]interface{})
		updateInput["Field"] = r.Form.Get("Field")
		updateInput["Product"] = r.Form.Get("Product")
		updateInput["ID"] = r.Form.Get("ID")
		updateInput["UserID"] = r.Form.Get("UserID")
	
		updateLoanChannel <- updateInput
		
		time.Sleep(time.Second * 1)
	
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, updateInput)
	}).Methods("PUT", "OPTIONS")
	
	
	fmt.Println("Server listening on", ServerPort)
	log.Fatal(http.ListenAndServe(ServerPort, r))
}
