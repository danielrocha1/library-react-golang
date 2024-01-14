import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Modal } from 'react-bootstrap';
import "./index.css"

const CrudLoan = ({data}) => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    UserID: '',
    ProdutoID: '',
    DataEmprestimo: '',
    DataDevolucao: '',
    StatusDeDevolucao: '',
    Expirado: ''
  });
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateField, setUpdateField] = useState('');
  const [updateValue, setUpdateValue] = useState('');

  const handleUpdateFieldChange = (e) => {
    setUpdateField(e.target.value);
    console.log(updateField)
  };
  const handleUpdateValueChange = (e) => {
    setUpdateValue(e.target.value);
  };

  const handleUpdateProduct = async () => {
    const updatedProducts = [...products];
    updatedProducts[editProduct] = {
      ...updatedProducts[editProduct],
      [updateField]: updateValue,
    };

    setProducts(updatedProducts);
    setEditProduct(null);
    setUpdateField('');
    setUpdateValue('');
    handleCloseModal();

    const newValue = updatedProducts[editProduct];
    console.log(newValue)
    console.log(newValue)

    const response = await fetch(`http://localhost:8080/updateLoan/?Field=${updateField}&Product=${newValue[updateField]}&ID=${newValue.EmprestimoID}&UserID=${newValue.UserID}`, {
      method: "PUT",
    })
      .then(response => response)
      .then(data => {
        console.log(data);
      })
      .catch(error => console.error("Erro ao obter os produtos:", error));
  };


  const handleAddProduct = async () => {
    const response = await fetch('http://localhost:8080/insertLoan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      const updatedProducts = await response.json();
      setProducts(updatedProducts);
      setNewProduct({
        UserID: '',
        ProdutoID: '',
        DataEmprestimo: '',
        DataDevolucao: '',
        StatusDeDevolucao: '',
        Expirado: ''
      });
      handleCloseModal();
    } else {
      console.error('Erro ao adicionar produto');
    }
  };

  const handleEditProduct = (index) => {
    setEditProduct(index);
    setNewProduct(products[index]); // Preenche o formulário com os dados do produto selecionado
    setShowModal(true);
  };

  const handleDeleteProduct = async (index) => {
    const response = await fetch(`http://localhost:8080/deleteLoan/${products[index].EmprestimoID}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const updatedProducts = await response.json();
      setProducts(updatedProducts);
    } else {
      console.error('Erro ao excluir produto');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditProduct(null);
    setNewProduct({
      UserID: '',
      ProdutoID: '',
      DataEmprestimo: '',
      DataDevolucao: '',
      StatusDeDevolucao: '',
      Expirado: ''
    });
  };

  useEffect(() => {
    fetch("http://localhost:8080/selectLoan")
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Erro ao obter os produtos:", error));
  }, []);



  return (
    <div className="App">
      <h1>Simple CRUD</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Product ID</th>
            <th>Loan Date</th>
            <th>Return Date</th>
            <th>Return Status</th>
            <th>Expired</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.EmprestimoID}</td>
              <td>{product.UserID}</td>
              <td>{product.ProdutoID}</td>
              <td>{product.DataEmprestimo}</td>
              <td>{product.DataDevolucao}</td>
              <td>{product.StatusDeDevolucao}</td>
              <td>{product.Expirado ? 'Sim' : 'Não'}</td>
              <td>
                <Button variant="info" onClick={() => handleEditProduct(index)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteProduct(index)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add Product
      </Button>

      <Modal show={showModal} onHide={handleCloseModal} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>{editProduct !== null ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUserID">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                name="updateField"
                value="UserID"
                checked={updateField === 'UserID'}
                onChange={handleUpdateFieldChange}
              />
            </Form.Group>
            <Form.Group controlId="formProdutoID">
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="radio"
                name="updateField"
                value="ProdutoID"
                checked={updateField === 'ProdutoID'}
                onChange={handleUpdateFieldChange}
              />
            </Form.Group>
            <Form.Group controlId="formStatusDeDevolucao">
              <Form.Label>Return Status</Form.Label>
              <Form.Control
             type="radio"
                placeholder="Enter return status"
                name="updateFiel"
                value="StatusDeDevolucao"
                checked={updateField === 'StatusDeDevolucao'}
                onChange={handleUpdateFieldChange}
              />
            </Form.Group>
            <Form.Group controlId="formExpirado">
              <Form.Label>Expired</Form.Label>
              <Form.Control
                type="radio"
                placeholder="Enter expiration status"
                name="updateFiel"
                value="Expirado"
                checked={updateField === 'Expirado'}
                onChange={handleUpdateFieldChange}
              />
            </Form.Group>
            <Form.Group controlId="formUpdateValue">
              <Form.Label>New Value</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Enter new ${updateField} value`}
                value={updateValue}
                onChange={handleUpdateValueChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={editProduct !== null ? handleUpdateProduct : handleAddProduct}>
            {editProduct !== null ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CrudLoan;