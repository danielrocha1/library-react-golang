import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Modal } from 'react-bootstrap';
import "./index.css"

const CrudBooks = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, qtd: 0, image: '' });
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateField, setUpdateField] = useState('name');
  const [updateValue, setUpdateValue] = useState('');

  const handleUpdateFieldChange = (e) => {
    setUpdateField(e.target.value);
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
    
    setNewProduct({ name: '', price: 0, qtd: 0, image: '' });
    setUpdateField('name');
    setUpdateValue('');
    handleCloseModal();

const newValue = updatedProducts[editProduct]

    
    const response = await fetch(`http://localhost:8080/update/?Field=${updateField}&Product=${newValue[updateField]}&ID=${newValue.id}`,{
      method:"PUT",
    })
      .then(response => response)
      .then(data => {
        console.log(data)
      })
      .catch(error => console.error("Erro ao obter os produtos:", error));
   
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = () => {
    setProducts([...products, newProduct]);
    setNewProduct({ name: '', price: 0, qtd: 0, image: '' });
    handleCloseModal();
  };

  const handleEditProduct = (index) => {
    setEditProduct(index);
    setNewProduct(products[index]); // Preenche o formulário com os dados do produto selecionado
    setShowModal(true);
  };
  

  const handleDeleteProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditProduct(null);
    setNewProduct({ name: '', price: 0, qtd: 0, image: '' });
  };


  useEffect(() => {
    // const storedToken = localStorage.getItem('token'); 
    // setIsLoggedIn(!!storedToken);

    fetch("http://localhost:8080/select")
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Erro ao obter os produtos:", error));

      
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden'; // Impede a rolagem
    } else {
      document.body.style.overflow = 'auto'; // Permite a rolagem
    }
  
    return () => {
      document.body.style.overflow = 'auto'; // Garante que a rolagem é permitida ao fechar o modal
    };
  }, [modalOpen]);


  return (
    <div className="App">
      <h1>Simple CRUD</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
          <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
            <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.qtd}</td>
              <td>{product.image}</td>
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
            <Form.Group controlId="formUpdateField">
              <Form.Label>Field to Update</Form.Label>
              <Form.Check
                type="radio"
                label="Name"
                name="updateField"
                value="name"
                checked={updateField === 'name'}
                onChange={handleUpdateFieldChange}
              />
              <Form.Check
                type="radio"
                label="Price"
                name="updateField"
                value="price"
                checked={updateField === 'price'}
                onChange={handleUpdateFieldChange}
              />
              <Form.Check
                type="radio"
                label="Quantity"
                name="updateField"
                value="qtd"
                checked={updateField === 'qtd'}
                onChange={handleUpdateFieldChange}
              />
              <Form.Check
                type="radio"
                label="Image"
                name="updateField"
                value="image"
                checked={updateField === 'image'}
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



export default CrudBooks;