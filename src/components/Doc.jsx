import React, { useEffect, useState } from 'react';
import { Button, Card, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';
import { database } from '../config';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Doc() {
  const [text, setText] = useState('');
  const [documents, setDocuments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(database, 'Doc'));
      const docs = [];
      querySnapshot.forEach(doc => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setDocuments(docs);
    };
    fetchData();
  }, []);

  const handleAddDocument = async () => {
    await addDoc(collection(database, 'Doc'), { text });
    setText('');
  
    
    const querySnapshot = await getDocs(collection(database, 'Doc'));
    const updatedDocuments = [];
    querySnapshot.forEach(doc => {
      updatedDocuments.push({ id: doc.id, ...doc.data() });
    });
    setDocuments(updatedDocuments);
  
    setShowAddModal(false); 
  };
  
  const handleDeleteDocument = async (id) => {
    await deleteDoc(doc(database, 'Doc', id));
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleEditDocument = (id, text) => {
    setSelectedDocument({ id, text });
    setShowEditModal(true);
  };

const handleSaveEdit = async () => {

  await addDoc(collection(database, 'Doc'), { text: selectedDocument.text });
  await deleteDoc(doc(database, 'Doc', selectedDocument.id));


  setShowEditModal(false);
  setSelectedDocument(null);


  const updatedDocuments = documents.map(doc => {
    if (doc.id === selectedDocument.id) {
      return { id: doc.id, text: selectedDocument.text };
    } else {
      return doc;
    }
  });
  setDocuments(updatedDocuments);
};
  

  return (
    <>
      <div>
        <div className='d-flex justify-content-center align-items-center'>
          <Button className='border rounded text-dark bg-light bolder mt-1' variant="primary" onClick={() => setShowAddModal(true)}>
            + ADD A DOCUMENT
          </Button>
        </div>
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Body>
            <FloatingLabel controlId="floatingTextarea" label="Add Document" className="mb-3 border-0">
              <Form.Control value={text} onChange={(e) => setText(e.target.value)} as="textarea" placeholder="Add Document" />
            </FloatingLabel>
          </Modal.Body>
          <Modal.Footer className='d-flex justify-content-center align-items-center border-0'>
            <Button className='border rounded text-dark bg-light bolder' variant="primary" onClick={handleAddDocument}>
              ADD
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className='container' style={{ marginTop: '100px' }}>
        <Row>
          {documents.map(doc => (
            <Col className="mb-5" sm={12} md={6} lg={4} xl={3} key={doc.id}>
              <Card className='shadow rounded' style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>{doc.text}</Card.Title>
                </Card.Body>
                <div className='d-flex justify-content-between align-items-center'>
                  <button onClick={() => handleDeleteDocument(doc.id)} className='btn btn-outline-none'><i className="fa-solid fa-trash text-warning"></i></button>
                  <button onClick={() => handleEditDocument(doc.id, doc.text)} className='btn btn-outline-none'><i className="fa-solid fa-pen-to-square text-info"></i></button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Body>
          <div className='container w-100'>
            <ReactQuill theme="snow" value={selectedDocument ? selectedDocument.text : ''} onChange={(value) => setSelectedDocument({ ...selectedDocument, text: value })} />
          </div>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center align-items-center border-0'>
          <Button className='border rounded text-dark bg-light bolder' variant="primary" onClick={handleSaveEdit}>
            SAVE
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Doc;
